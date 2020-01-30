import chai = require('chai');
import sinon = require('sinon');
import    sinonChai = require("sinon-chai");
import {
    createOAuth2Server,
    OAuth2Server,
    IRefreshTokenModel,
    IPasswordModel,
    IAuthenticationModel,
    IClient, Falsey, IUser, IToken, GrantType, Utils
} from "../index";
import {Promises} from "appolo-utils";
import {TestModel} from "./testModel";

let should = require('chai').should();
chai.use(sinonChai);


describe("OAuth2Server Spec", function () {

    let server: OAuth2Server, model: TestModel;


    beforeEach(async () => {
        model = new TestModel();
        server = await createOAuth2Server({scopes: ["scopeTest"], model})

    });

    afterEach(async () => {

    });

    it("should get token", async () => {

        let token = await server.login({
            scope: ["scopeTest"],
            clientId: "aa",
            clientSecret: "bb",
            username: "ccc",
            password: "ddd"
        });


        token.accessToken.should.be.ok;
        token.accessTokenExpiresAt.should.be.ok;
        token.refreshTokenExpiresAt.should.be.ok;
        token.refreshToken.should.be.ok;
        token.client.id.should.be.be.eq("111");
        token.scope[0].should.be.eq("scopeTest");
        token.user.userName.should.be.eq("test");

        (new Date(token.refreshTokenExpiresAt).valueOf() - new Date().valueOf()).should.be.gt(7000000);
        (new Date(token.accessTokenExpiresAt).valueOf() - new Date().valueOf()).should.be.gt(3500000);

    });

    it("should throw invalid client", async () => {

        try {
            let token = await server.login({
                scope: ["scopeTest"],
                clientId: "aaa",
                clientSecret: "bb",
                username: "ccc",
                password: "ddd"
            });
            token.should.not.be.ok;
        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("invalid_client");
            e.code.should.be.eq(400);
        }
    });

    it("should throw invalid password", async () => {

        try {
            let token = await server.login({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                username: "ccc",
                password: "dddc"
            });
            token.should.not.be.ok;
        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("invalid_grant");
            e.message.should.be.eq("Invalid grant: user credentials are invalid");
            e.code.should.be.eq(400);
        }
    });

    it("should throw scope password", async () => {

        try {
            let token = await server.login({
                scope: ["scopeTest2"],
                clientId: "aa",
                clientSecret: "bb",
                username: "ccc",
                password: "ddd"
            });
            token.should.not.be.ok;
        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("invalid_scope");
            e.message.should.be.eq("Invalid scope: Requested scope is invalid");
            e.code.should.be.eq(400);
        }
    });

    it("should throw invalid grant type password", async () => {

        let stub = sinon.stub(model, "getClient").callsFake(() => {
            return Promise.resolve({grants: [], id: "111"})
        });

        try {

            let token = await server.login({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                username: "ccc",
                password: "ddd"
            });
            token.should.not.be.ok;
        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("unauthorized_client");
            e.message.should.be.eq("Unauthorized client: `grant_type` is invalid");
            e.code.should.be.eq(400);
        }

        stub.restore();
    });

    it("should get token", async () => {

        let token = await server.login({
            scope: ["scopeTest"],
            clientId: "aa",
            clientSecret: "bb",
            username: "ccc",
            password: "ddd"
        });

        token.should.be.ok;

        let tokenResult = await server.authenticate({token: token.accessToken});

        tokenResult.should.be.ok;

        tokenResult.should.be.eq(token)
    });

    it("should throw expire token", async () => {
        let clock;
        try {
            let token = await server.login({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                username: "ccc",
                password: "ddd"
            });

            token.should.be.ok;

            let now = new Date();

            now.setSeconds(now.getSeconds() + (60 * 60) + 100);

            clock = sinon.useFakeTimers({
                now: now,
                shouldAdvanceTime: true,

            });

            let tokenResult = await server.authenticate({token: token.accessToken});

            tokenResult.should.not.be.ok;

        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("invalid_token");
            e.message.should.be.eq("Invalid token: access token has expired");
            e.code.should.be.eq(401);
        }

        clock.restore();
    });

    it("should throw invalid token", async () => {

        try {
            let token = await server.login({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                username: "ccc",
                password: "ddd"
            });

            token.should.be.ok;

            let tokenResult = await server.authenticate({token: token.accessToken + "11"});

            tokenResult.should.not.be.ok;

        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("invalid_token");
            e.message.should.be.eq("Invalid token: access token is invalid");
            e.code.should.be.eq(401);
        }
    });

    it("should get refresh token", async () => {

        let token = await server.login({
            scope: ["scopeTest"],
            clientId: "aa",
            clientSecret: "bb",
            username: "ccc",
            password: "ddd"
        });

        token.should.be.ok;

        let tokenResult = await server.refreshToken({
            scope: ["scopeTest"],
            clientId: "aa",
            clientSecret: "bb",
            refreshToken: token.refreshToken
        });

        tokenResult.accessToken.should.be.ok;
        tokenResult.accessToken.should.not.be.eq(token.accessToken);
        tokenResult.accessTokenExpiresAt.should.be.ok;
        tokenResult.refreshTokenExpiresAt.should.be.ok;
        tokenResult.refreshToken.should.be.ok;
        tokenResult.client.id.should.be.be.eq("111");
        tokenResult.scope[0].should.be.eq("scopeTest");
        tokenResult.user.userName.should.be.eq("test");

        (new Date(tokenResult.refreshTokenExpiresAt).valueOf() - new Date().valueOf()).should.be.gt(7000000);
        (new Date(tokenResult.accessTokenExpiresAt).valueOf() - new Date().valueOf()).should.be.gt(3500000);
    });

    it("should throw expire refresh token", async () => {
        let clock;
        try {

            let token = await server.login({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                username: "ccc",
                password: "ddd"
            });

            token.should.be.ok;

            let now = new Date();

            now.setSeconds(now.getSeconds() + (60 * 60 * 2) + 100);

            clock = sinon.useFakeTimers({
                now: now,
                shouldAdvanceTime: true,

            });

            let tokenResult = await server.refreshToken({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                refreshToken: token.refreshToken
            });

            tokenResult.should.not.be.ok;


        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("invalid_grant");
            e.message.should.be.eq("Invalid grant: refresh token has expired");
            e.code.should.be.eq(400);
        }
        clock.restore()
    });

    it("should throw invalid refresh token", async () => {

        try {

            let token = await server.login({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                username: "ccc",
                password: "ddd"
            });

            token.should.be.ok;

            let tokenResult = await server.refreshToken({
                scope: ["scopeTest"],
                clientId: "aa",
                clientSecret: "bb",
                refreshToken: token.refreshToken + "11"
            });

            tokenResult.should.not.be.ok;


        } catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("invalid_grant");
            e.message.should.be.eq("Invalid grant: refresh token is invalid");
            e.code.should.be.eq(400);
        }

    });

    it("should parse Authorization", async () => {
        let {name, pass} = Utils.parseAuthorization("Basic YWFhYTpGeTlRZlhoUFhXQWNNYVdQ");

        name.should.be.eq("aaaa")
        pass.should.be.eq("Fy9QfXhPXWAcMaWP")
    });

    it("should  bump lifeTime", async () => {
        let clock;
        let server = await createOAuth2Server({model: new TestModel(), bumpLifeTime: true,bumpLifeTimeMinDiff:0});

        let token = await server.login({
            scope: ["scopeTest"],
            clientId: "aa",
            clientSecret: "bb",
            username: "ccc",
            password: "ddd", accessTokenLifetime: 60, refreshTokenLifetime: 120
        });

        token.should.be.ok;

        token.accessToken.should.be.ok;
        token.accessTokenLifetime.should.be.eq(60);
        token.refreshTokenLifetime.should.be.eq(120);

        let now = new Date();

        now.setSeconds(now.getSeconds() + (40));

        clock = sinon.useFakeTimers({
            now: now,
            shouldAdvanceTime: true,

        });

        let tokenResult = await server.authenticate({token: token.accessToken});

        tokenResult.accessTokenLifetime.should.be.eq(60);
        tokenResult.refreshTokenLifetime.should.be.eq(120);

        (new Date(tokenResult.refreshTokenExpiresAt).valueOf() - new Date().valueOf()).should.be.gte(120000);
        (new Date(tokenResult.accessTokenExpiresAt).valueOf() - new Date().valueOf()).should.be.gte(60000);

        clock.restore();
    });

    it("should validate scope", async () => {
        let server = await createOAuth2Server({model: new TestModel(), bumpLifeTime: true});

        let token = await server.login({
            scope: ["scopeTest"],
            clientId: "aa",
            clientSecret: "bb",
            username: "ccc",
            password: "ddd", accessTokenLifetime: 60, refreshTokenLifetime: 120
        });

        token.should.be.ok;

        let tokenResult = await server.authenticate({token: token.accessToken,scope:["scopeTest"]});

        tokenResult.accessToken.should.be.ok;

        try{
            let tokenResult = await server.authenticate({token: token.accessToken,scope:["scopeTest2"]});

            tokenResult.accessToken.should.not.be.ok;


        }catch (e) {
            e.should.be.ok;
            e.name.should.be.eq("insufficient_scope");
            e.message.should.be.eq("Insufficient scope: authorized scope is insufficient");
            e.code.should.be.eq(403);
        }

    });



});


