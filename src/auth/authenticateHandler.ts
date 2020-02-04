import {IRefreshToken, IToken} from "../interfaces/IToken";
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
import * as _ from "lodash";

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

        await this._verifyScope(accessToken, this.options.scopes);

        this._validateTokenScope(accessToken, opts.scope);

        if (this.options.bumpLifeTime) {
            await this._bumpLifetime(accessToken)
        }

        return accessToken;
    }

    private _validateTokenScope(token: IToken, scope: string[]): boolean {
        if (scope && scope.length && token.scope && !scope.every(s => token.scope.includes(s))) {
            throw new InsufficientScopeError('Insufficient scope: authorized scope is insufficient');
        }

        return true
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

        if (!token.accessTokenLifetime) {
            return token
        }

        let newAccessTokenLifetime = this.tokensHelper.getExpireDate(token.accessTokenLifetime);

        let diff = Math.abs(newAccessTokenLifetime.getTime() - token.accessTokenExpiresAt.getTime());

        if (diff >= (this.options.bumpLifeTimeMinDiff * 1000)) {

            token.accessTokenLifetime && (token.accessTokenExpiresAt = newAccessTokenLifetime);
            token.refreshTokenLifetime && (token.refreshTokenExpiresAt = this.tokensHelper.getExpireDate(token.refreshTokenLifetime));

            let refresh = _.omit(token, ["accessTokenLifetime", "accessToken", "accessTokenExpiresAt"]) as IRefreshToken;

            [token] = await this.tokensHelper.saveTokens(token, refresh, token.client, token.user);
        }

        return token;

    }

}
