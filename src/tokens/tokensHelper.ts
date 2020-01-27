import {define, inject, singleton} from "appolo-engine";
import {Guid} from "appolo-utils";
import {IOptions} from "../interfaces/IOptions";
import {IClient} from "../interfaces/IClient";
import {IUser} from "../interfaces/IUser";
import {IRefreshToken, IToken} from "../interfaces/IToken";
import {IPasswordModel, IRefreshTokenModel} from "../interfaces/IModel";
import {ServerError} from "../common/errors/serverError";
import {Promises} from "appolo-utils";
import {InvalidGrantError} from "../common/errors/invalidGrantError";
import {ClientHandler} from "../clients/clientHandler";
import {UnauthorizedClientError} from "../common/errors/unauthorizedClientError";
import {GrantType} from "../common/enums";

@define()
@singleton()
export class TokensHelper {

    @inject() private options: IOptions;

    @inject() clientHandler: ClientHandler;


    public async generateAccessToken(opts: { client: IClient, user: IUser, scopes: string[] }): Promise<string> {

        let token, model = this.options.model as IPasswordModel;

        if (model.generateAccessToken) {
            token = await model.generateAccessToken(opts.client, opts.user, opts.scopes)
        }

        return token || Guid.guid();
    }

    public async generateRefreshToken(opts: { client: IClient, user: IUser, scopes: string[] }): Promise<string> {

        let token, model = this.options.model as IRefreshTokenModel;

        if (model.generateRefreshToken) {
            token = await model.generateRefreshToken(opts.client, opts.user, opts.scopes)
        }

        return token || Guid.guid();
    }

    public getAccessTokenExpiresAt(client: IClient): Date {
        let tokenLifeTime = (client.accessTokenLifetime || this.options.accessTokenLifetime);

        return this._getExpireDate(tokenLifeTime);
    }

    public getRefreshTokenExpiresAt(client: IClient): Date {

        let tokenLifeTime = (client.refreshTokenLifetime || this.options.refreshTokenLifetime);

        return this._getExpireDate(tokenLifeTime);
    }

    private _getExpireDate(tokenLifeTime: number): Date {
        let expires = new Date();

        expires.setSeconds(expires.getSeconds() + tokenLifeTime);

        return expires;
    }

    public async createTokens(opts: { client: IClient, user: IUser, scopes: string[] }): Promise<IToken> {


        let [token, refreshToken] = await Promise.all([
            this._createAccessToken(opts),
            this.options.useRefreshToken && this.createRefreshToken(opts)]);


        if (this.options.useRefreshToken) {
            token.refreshTokenExpiresAt = refreshToken.refreshTokenExpiresAt;
            token.refreshToken = refreshToken.refreshToken;
        }

        [token, refreshToken] = await Promise.all([
            this.saveToken(token as IToken, opts.client, opts.user),
            this.options.useRefreshToken && this.saveTokenRefresh(refreshToken as IRefreshToken, opts.client, opts.user)]);


        return token as IToken;
    }

    private async _createAccessToken(opts: { client: IClient, user: IUser, scopes: string[] }): Promise<IToken> {

        let accessToken = await this.generateAccessToken(opts);

        let token: IToken = {
            accessToken: accessToken,
            accessTokenExpiresAt: this.getAccessTokenExpiresAt(opts.client),
            client: opts.client,
            scope: opts.scopes,
            user: opts.user
        };

        return token;
    }

    public async createRefreshToken(opts: { client: IClient, user: IUser, scopes: string[] }): Promise<IRefreshToken> {

        let refreshToken = await this.generateRefreshToken(opts);

        let token: IRefreshToken = {
            client: opts.client,
            scope: opts.scopes,
            refreshToken: refreshToken,
            refreshTokenExpiresAt: this.getRefreshTokenExpiresAt(opts.client),
            user: opts.user
        };

        return token;
    }

    public async saveToken(token: IToken, client: IClient, user: IUser): Promise<IToken> {

        let promise = (this.options.model as IPasswordModel).saveToken(token, client, user);

        let [err, validToken] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!validToken) {
            throw new ServerError(`server error: failed to save token}`)
        }

        return validToken;

    }

    public async saveTokenRefresh(token: IRefreshToken, client: IClient, user: IUser): Promise<IRefreshToken> {

        let promise = (this.options.model as IRefreshTokenModel).saveRefreshToken(token, client, user);

        let [err, validToken] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!validToken) {
            throw new ServerError(`server error: failed to save refresh token}`)
        }

        return validToken
    }

    public async revokeRefreshToken(token: IRefreshToken) {
        let model = this.options.model as IRefreshTokenModel;

        let promise = model.revokeRefreshToken(token);

        let [err, result] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!result) {
            throw new InvalidGrantError('Invalid grant: failed to revoke token');
        }
    }

    public async revokeAccessToken(token: IToken) {
        let model = this.options.model as IPasswordModel;

        let promise = model.revokeToken(token);

        let [err, result] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!result) {
            throw new InvalidGrantError('Invalid grant: failed to token');
        }
    }


}
