import {GrantType} from "../common/enums";

interface IBaseParams {
    clientId: string,
    clientSecret: string
    scope: string[]
}

interface ITokenLifetimeParams {
    accessTokenLifetime?: number;
    refreshTokenLifetime?: number;
}

export interface ILoginParams extends IBaseParams, ITokenLifetimeParams {

    username: string,
    password: string,

}

export interface IRefreshParams extends IBaseParams, ITokenLifetimeParams {

    refreshToken: string,

}

export interface IAuthenticateParams {
    token: string
}
