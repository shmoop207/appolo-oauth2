import {define, singleton, alias, inject} from "appolo-engine";
import {IOptions} from "../interfaces/IOptions";
import {IPasswordModel, IRefreshTokenModel} from "../interfaces/IModel";
import {InvalidGrantError} from "../common/errors/invalidGrantError";
import {ServerError} from "../common/errors/serverError";
import {TokensHelper} from "../tokens/tokensHelper";
import {IRefreshToken, IToken} from "../interfaces/IToken";
import {IGrantHandler, IGrantParams} from "../interfaces/IGrantHandler";
import {Promises} from "appolo-utils";
import {GrantType} from "../common/enums";
import {IClient} from "../interfaces/IClient";
import {ClientHandler} from "../clients/clientHandler";
import {IRefreshParams} from "../interfaces/ITokenParams";

@define()
@singleton()
@alias("IGrantHandler")
export class RefreshGrantHandler {

    @inject() options: IOptions;
    @inject() tokensHelper: TokensHelper;
    @inject() clientHandler: ClientHandler;


    public async refreshToken(params: IRefreshParams): Promise<IToken> {

        let {refreshToken, scope, clientSecret, clientId} = params;

        let client = await this.clientHandler.getClient({
            clientId,
            clientSecret,
            scope,
            grantType: GrantType.RefreshToken
        });

        let refreshTokenDb = await this._getRefreshToken(refreshToken);

        this._validateToken(refreshTokenDb, client);

        await this.tokensHelper.revokeRefreshToken(refreshTokenDb);

        let token = await this.tokensHelper.createTokens({
            scopes: refreshTokenDb.scope,
            client: client,
            user: refreshTokenDb.user,
            refreshTokenLifetime: params.refreshTokenLifetime,
            accessTokenLifetime: params.accessTokenLifetime
        });

        return token;
    }

    private _validateToken(token: IRefreshToken, client: IClient) {


        if (!token.client) {
            throw new ServerError('Server error: `getRefreshToken()` did not return a `client`');
        }

        if (!token.user) {
            throw new ServerError('Server error: `getRefreshToken()` did not return a `user`');
        }

        if (token.client.id !== client.id) {
            throw new InvalidGrantError('Invalid grant: refresh token is invalid');
        }

        if (token.refreshTokenExpiresAt && !(token.refreshTokenExpiresAt instanceof Date)) {
            throw new ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
        }

        if (token.refreshTokenExpiresAt && token.refreshTokenExpiresAt < new Date()) {
            throw new InvalidGrantError('Invalid grant: refresh token has expired');
        }
    }

    private async _getRefreshToken(token: string): Promise<IRefreshToken> {

        let promise = (this.options.model as IRefreshTokenModel).getRefreshToken(token);

        let [err, refreshToken] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!refreshToken) {
            throw new InvalidGrantError('Invalid grant: refresh token is invalid');
        }

        return refreshToken
    }


}
