import {define, singleton, alias, inject} from "appolo-engine";
import {IOptions} from "../interfaces/IOptions";
import {IPasswordModel, IRefreshTokenModel} from "../interfaces/IModel";
import {InvalidGrantError} from "../common/errors/invalidGrantError";
import {ServerError} from "../common/errors/serverError";
import {TokensHelper} from "../tokens/tokensHelper";
import {IRefreshToken, IToken} from "../interfaces/IToken";
import {IGrantHandler, IGrantParams} from "../interfaces/IGrantHandler";
import {Promises} from "appolo-utils";

@define()
@singleton()
@alias("IGrantHandler")
export class RefreshGrantHandler implements IGrantHandler {

    @inject() moduleOptions: IOptions;
    @inject() baseGrantHandler: TokensHelper;

    public async handle(params: IGrantParams): Promise<IToken> {

        let refreshToken = await this._getRefreshToken(params.refreshToken);

        this._validateToken(refreshToken);

        await this.baseGrantHandler.revokeRefreshToken(refreshToken);

        let token = await this.baseGrantHandler.createTokens({
            scopes: refreshToken.scope,
            client: params.client,
            user: refreshToken.user
        });

        return token;
    }

    private _validateToken(token: IRefreshToken) {


        if (!token.client) {
            throw new ServerError('Server error: `getRefreshToken()` did not return a `client`');
        }

        if (!token.user) {
            throw new ServerError('Server error: `getRefreshToken()` did not return a `user`');
        }

        if (token.client.id !== token.id) {
            throw new InvalidGrantError('Invalid grant: refresh token is invalid');
        }

        if (token.refreshTokenExpiresAt && !(token.refreshTokenExpiresAt instanceof Date)) {
            throw new ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
        }

        if (token.refreshTokenExpiresAt && token.refreshTokenExpiresAt < new Date()) {
            throw new InvalidGrantError('Invalid grant: refresh token has expired');
        }
    }

    private async _getRefreshToken(token: string):Promise<IRefreshToken> {

        let promise = (this.moduleOptions.model as IRefreshTokenModel).getRefreshToken(token);

        let [err,refreshToken] = await Promises.to(promise);

        if(err){
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!refreshToken) {
            throw new InvalidGrantError('Invalid grant: refresh token is invalid');
        }

        return refreshToken
    }


}
