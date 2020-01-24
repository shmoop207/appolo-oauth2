import {IAuthenticationModel, IPasswordModel, IRefreshTokenModel} from "./IModel";

export interface IOptions extends AuthenticateOptions, TokenOptions {
    model: IRefreshTokenModel | IPasswordModel | IAuthenticationModel;
}


interface AuthenticateOptions {

    scopes?: string[];
}


interface TokenOptions {
    /**
     * Lifetime of generated access tokens in seconds (default = 1 hour)
     */
    accessTokenLifetime?: number;

    /**
     * Lifetime of generated refresh tokens in seconds (default = 2 weeks)
     */
    refreshTokenLifetime?: number;

    useRefreshToken?: boolean

}
