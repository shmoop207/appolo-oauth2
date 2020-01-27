import {alias, define, inject, singleton} from "appolo-engine";
import {IOptions} from "../interfaces/IOptions";
import {IPasswordModel} from "../interfaces/IModel";
import {InvalidGrantError} from "../common/errors/invalidGrantError";
import {ServerError} from "../common/errors/serverError";
import {IClient} from "../interfaces/IClient";
import {InvalidScopeError} from "../common/errors/invalidScopeError";
import {TokensHelper} from "../tokens/tokensHelper";
import {IToken} from "../interfaces/IToken";
import {IUser} from "../interfaces/IUser";
import {IGrantHandler} from "../interfaces/IGrantHandler";
import {InvalidRequestError} from "../common/errors/invalidRequestError";
import {Promises} from "appolo-utils";
import {GrantType} from "../common/enums";
import {ClientHandler} from "../clients/clientHandler";
import {ILoginParams} from "../interfaces/ITokenParams";

@define()
@singleton()
@alias("IGrantHandler")
export class PasswordGruntHandler {

    @inject() options: IOptions;
    @inject() tokensHelper: TokensHelper;
    @inject() clientHandler: ClientHandler;


    public async createToken(params: ILoginParams): Promise<IToken> {

        let {username, password, scope, clientSecret, clientId} = params;

        if (!username) {
            throw new InvalidRequestError('Missing parameter: `username`');
        }

        if (!password) {
            throw new InvalidRequestError('Missing parameter: `Password`');
        }

        let client = await this.clientHandler.getClient({clientId, clientSecret, scope, grantType: GrantType.Password});


        let user = await this._getUser(username, password);

        let scopes = await this._validateScope(user, client, scope);


        let token = await this.tokensHelper.createTokens({user, client, scopes});

        return token;

    }

    private async _getUser(username: string, password: string) {

        let promise = (this.options.model as IPasswordModel).getUser(username, password);

        let [err, user] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`);
        }

        if (!user) {
            throw new InvalidGrantError('Invalid grant: user credentials are invalid');
        }

        return user;
    }

    private async _validateScope(user: IUser, client: IClient, scopes: string[]): Promise<string[]> {

        let promise = (this.options.model as IPasswordModel).validateScope(user, client, scopes);

        let [err, validScopes] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!validScopes || !validScopes.length) {

            throw new InvalidScopeError('Invalid scope: Requested scope is invalid');
        }

        return validScopes
    }


}
