import {IToken} from "../interfaces/IToken";
import {define, singleton, inject} from "appolo-engine";
import {IOptions} from "../interfaces/IOptions";
import {IAuthenticationModel} from "../interfaces/IModel";
import {Promises} from "appolo-utils";
import {ServerError} from "../common/errors/serverError";
import {InvalidTokenError} from "../common/errors/invalidTokenError";
import {UnauthorizedRequestError} from "../common/errors/unauthorizedRequestError";
import {InsufficientScopeError} from "../common/errors/insufficientScopeError";
import {IAuthenticateParams} from "../interfaces/ITokenParams";

@define()
@singleton()
export class AuthenticateHandler {

    @inject() private options: IOptions;

    public async getToken(opts: IAuthenticateParams): Promise<IToken> {

        if (!opts.token) {
            throw new UnauthorizedRequestError('Unauthorized request: no authentication given');
        }

        let accessToken = await this._getToken(opts.token);


        this._validateToken(accessToken);

        await this._verifyScope(accessToken);

        return accessToken;
    }

    private async _getToken(token: string): Promise<IToken> {

        let promise = (this.options.model as IAuthenticationModel).getAccessToken(token);

        let [err, accessToken] = await Promises.to(promise);

        if (err) {
            throw new ServerError('Server error: `failed to get token');
        }

        if (!accessToken) {
            throw new InvalidTokenError('Invalid token: access token is invalid');
        }

        return accessToken as IToken;

    }

    private async _verifyScope(token: IToken) {

        if (!this.options.scopes || !this.options.scopes.length) {
            return
        }

        let promise = (this.options.model as IAuthenticationModel).verifyScope(token, this.options.scopes);

        let [err, result] = await Promises.to(promise);

        if (err) {
            throw new ServerError('Server error: `failed to` must be a Date instance');
        }

        if (!result) {
            throw new InsufficientScopeError('Insufficient scope: authorized scope is insufficient');
        }
    }

    private _validateToken(accessToken: IToken): void {
        if (!(accessToken.accessTokenExpiresAt instanceof Date)) {
            throw new ServerError('Server error: `accessTokenExpiresAt` must be a Date instance');
        }

        if (accessToken.accessTokenExpiresAt < new Date()) {
            throw new InvalidTokenError('Invalid token: access token has expired');
        }

    }

}
