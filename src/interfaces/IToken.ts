import {IClient} from "./IClient";
import {IUser} from "./IUser";

export interface IToken extends IRefreshToken {
    accessToken: string;
    accessTokenExpiresAt?: Date;
    accessTokenLifetime?: number
}

export interface IRefreshToken {
    refreshToken?: string;
    refreshTokenExpiresAt?: Date;
    refreshTokenLifetime?: number
    scope?: string[];
    client: IClient;
    user: IUser;

    [key: string]: any;
}
