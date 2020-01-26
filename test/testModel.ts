import {
    IToken,
    IUser,
    IClient,
    Falsey,
    IAuthenticationModel,
    IPasswordModel,
    IRefreshTokenModel,
    IRefreshToken
} from "../index";
import {Guid} from "appolo-utils";


export class TestModel implements IPasswordModel, IAuthenticationModel, IRefreshTokenModel {

    private _tokens: { [index: string]: any } = {};
    private _refreshTokens: { [index: string]: any } = {};

    async getClient(clientId: string, clientSecret: string): Promise<IClient | Falsey> {
        if (clientId == "aa" && clientSecret == "bb") {
            return {grants: ["password","refreshToken"], id: "111"}
        }
    }

    async validateScope(user: IUser, client: IClient, scope: string[]): Promise<string[] | Falsey> {
        if (scope.includes("scopeTest")) {
            return ["scopeTest"]
        }
    }

    async getUser(username: string, password: string): Promise<IUser | Falsey> {
        if (username == "ccc" && password == "ddd") {
            return {userName: "test"}
        }
    }

    async revokeToken(token: IToken): Promise<boolean> {

        delete this._tokens[token.accessToken];

        return true;
    }

    async saveToken(token: IToken, client: IClient, user: IUser): Promise<IToken | Falsey> {

        this._tokens[token.accessToken] = token;

        return token;
    }

    async generateAccessToken(client: IClient, user: IUser, scope: string[]): Promise<string> {
        return Guid.guid();
    }

    async generateRefreshToken(client: IClient, user: IUser, scope: string[]): Promise<string> {
        return Guid.guid();

    }

    async getAccessToken(accessToken: string): Promise<IToken | Falsey> {
        return this._tokens[accessToken];
    }

    async getRefreshToken(refreshToken: string): Promise<IRefreshToken | Falsey> {
        return this._refreshTokens[refreshToken];
    }

    async revokeRefreshToken(token: IRefreshToken): Promise<boolean> {
        delete this._tokens[token.accessToken];
        return true
    }

    async saveRefreshToken(token: IRefreshToken, client: IClient, user: IUser): Promise<IRefreshToken | Falsey> {
         this._refreshTokens[token.refreshToken] = token;

         return  token;
    }

    async verifyScope(token: IToken, scope: string[]): Promise<boolean> {
        return token.scope.every(item => scope.includes(item))
    }


}
