import {define, inject, singleton} from "appolo-engine";
import {IClient} from "../interfaces/IClient";
import {IOptions} from "../interfaces/IOptions";
import {InvalidClientError} from "../common/errors/invalidClientError";
import {InvalidRequestError} from "../common/errors/invalidRequestError";
import {ServerError} from "../common/errors/serverError";
import {GrantType} from "../common/enums";
import {IBaseModel} from "../interfaces/IModel";
import {UnauthorizedClientError} from "../common/errors/unauthorizedClientError";

@define()
@singleton()
export class ClientHandler {

    @inject() options: IOptions;

    public async getClient(params: { clientId: string, clientSecret: string,grantType: GrantType, scope: string[]}): Promise<IClient> {

        if (!params.clientId || !params.clientSecret) {
            throw new InvalidRequestError("Invalid params: invalid clientId or clientSecret");
        }

        let client = await this._getClientFromModel(params.clientId, params.clientSecret);

        if (!client) {
            throw new InvalidClientError("Invalid client: client is invalid")
        }

        if (!client.grants || !Array.isArray(client.grants)) {
            throw  new ServerError("Server error: `grants` must be an array")
        }

        if (!client.grants.includes(params.grantType)) {
            throw  new UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
        }

        if (params.scope && client.scopes && client.scopes.length && !params.scope.every(scope => (client as IClient).scopes.includes(scope))) {
            throw new UnauthorizedClientError('Unauthorized client: `scope` is invalid');
        }

        return client;
    }

    private async _getClientFromModel(clientId: string, clientSecret: string) {
        try {
            let client = await (this.options.model as IBaseModel).getClient(clientId, clientSecret);

            return client;
        } catch (e) {
            throw new InvalidClientError(`Invalid client: ${(e || "").toString()}`)
        }

    }
}
