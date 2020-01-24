import {IClient} from "./IClient";
import {IUser} from "./IUser";
import {IRefreshToken, IToken} from "./IToken";

type Falsey = '' | 0 | false | null | undefined;


export interface IBaseModel {

    getClient(clientId: string, clientSecret: string): Promise<IClient | Falsey>;


}


export interface IAuthenticationModel {

    getAccessToken(accessToken: string): Promise<IToken | Falsey>;


    verifyScope?(token: IToken, scope: string[]): Promise<boolean>;
}

export interface IPasswordModel extends IBaseModel {

    generateAccessToken?(client: IClient, user: IUser, scope: string[]): Promise<string>;

    getUser(username: string, password: string): Promise<IUser | Falsey>;

    validateScope?(user: IUser, client: IClient, scope: string[]): Promise<string[] | Falsey>;

    revokeToken(token: IToken): Promise<boolean>;

    saveToken(token: IToken, client: IClient, user: IUser): Promise<IToken | Falsey>;
}

export interface IRefreshTokenModel extends IBaseModel {
    generateRefreshToken?(client: IClient, user: IUser, scope: string[]): Promise<string>;

    getRefreshToken(refreshToken: string): Promise<IRefreshToken | Falsey>;

    revokeRefreshToken(token: IRefreshToken): Promise<boolean>;

    saveRefreshToken(token: IRefreshToken, client: IClient, user: IUser): Promise<IRefreshToken | Falsey>;


}
