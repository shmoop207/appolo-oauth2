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
import {TokensHelper} from "../tokens/tokensHelper";

@define()
@singleton()
export class AuthenticateHandler {

    @inject() private options: IOptions;
    @inject() private tokensHelper: TokensHelper;

    public async getToken(opts: IAuthenticateParams): Promise<IToken> {

        if (!opts.token) {
            throw new UnauthorizedRequestError('Unauthorized request: no authentication given');
        }

        let accessToken = await this._getToken(opts);


        this._validateToken(accessToken);

        await Promise.all([this._verifyScope(accessToken, opts.scope), this._verifyScope(accessToken, this.options.scopes)]);

        return accessToken;
    }

    private async _getToken(opts: IAuthenticateParams): Promise<IToken> {

        let promise = (this.options.model as IAuthenticationModel).getAccessToken(opts.token);

        let [err, accessToken] = await Promises.to(promise);

        if (err) {
            throw new ServerError('Server error: `failed to get token');
        }

        if (!accessToken) {
            throw new InvalidTokenError('Invalid token: access token is invalid');
        }

        if (this.options.bumpLifeTime) {
            accessToken = await this._bumpLifetime(accessToken)
        }

        return accessToken as IToken;

    }

    private async _verifyScope(token: IToken, scopes: string[]) {

        if (!scopes || !scopes.length) {
            return
        }

        let promise = (this.options.model as IAuthenticationModel).verifyScope(token, scopes);

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

    private async _bumpLifetime(token: IToken): Promise<IToken> {

        token.accessTokenLifetime && (token.accessTokenExpiresAt = this.tokensHelper.getExpireDate(token.accessTokenLifetime));
        token.refreshTokenLifetime && (token.refreshTokenExpiresAt = this.tokensHelper.getExpireDate(token.refreshTokenLifetime));

        let [accessToken] = await this.tokensHelper.saveTokens(token, token, token.client, token.user);

        return accessToken;

    }

}
