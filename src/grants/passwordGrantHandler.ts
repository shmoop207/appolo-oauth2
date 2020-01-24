import {define, singleton, inject, alias} from "appolo-engine";
import {IOptions} from "../interfaces/IOptions";
import {IPasswordModel} from "../interfaces/IModel";
import {InvalidGrantError} from "../common/errors/invalidGrantError";
import {ServerError} from "../common/errors/serverError";
import {IClient} from "../interfaces/IClient";
import {InvalidScopeError} from "../common/errors/invalidScopeError";
import {TokensHelper} from "../tokens/tokensHelper";
import {IToken} from "../interfaces/IToken";
import {IUser} from "../interfaces/IUser";
import {IGrantHandler, IGrantParams} from "../interfaces/IGrantHandler";
import {InvalidRequestError} from "../common/errors/invalidRequestError";
import {Promises} from "appolo-utils";

@define()
@singleton()
@alias("IGrantHandler")
export class PasswordGruntHandler implements IGrantHandler {

    @inject() moduleOptions: IOptions;
    @inject() baseGrantHandler: TokensHelper;

    public async handle(params: IGrantParams): Promise<IToken> {

        if (!params.username) {
            throw new InvalidRequestError('Missing parameter: `username`');
        }

        if (!params.password) {
            throw new InvalidRequestError('Missing parameter: `password`');
        }

        let {client} = params;

        let user = this._getUser(params.username, params.password);

        let scopes = await this._validateScope(user, client, params.scope);


        let token = await this.baseGrantHandler.createTokens({user, client, scopes});

        return token;

    }

    private async _getUser(username: string, password: string) {

        let promise = (this.moduleOptions.model as IPasswordModel).getUser(username, password);

        let [err, user] = await Promises.to(promise);

        if (err) {
            throw new ServerError(`server error: ${(err || "").toString()}`);
        }

        if (!user) {
            throw new InvalidGrantError('Invalid grant: user credentials are invalid');
        }

        return user;
    }

    private async _validateScope(user: IUser, client: IClient, scopes: string[]):Promise<string[]> {

        let promise  = (this.moduleOptions.model as IPasswordModel).validateScope(user, client, scopes);

        let [err,validScopes] = await Promises.to(promise);

        if(err){
            throw new ServerError(`server error: ${(err || "").toString()}`)
        }

        if (!validScopes || !validScopes.length) {

            throw new InvalidScopeError('Invalid scope: Requested scope is invalid');
        }

        return validScopes
    }


}
