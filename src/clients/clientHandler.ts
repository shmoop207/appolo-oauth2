import {define, inject, singleton} from "appolo-engine";
import {ICreateTokenParams} from "../interfaces/ICreateTokenParams";
import {IToken} from "../interfaces/IToken";
import {IClient} from "../interfaces/IClient";
import {IOptions} from "../interfaces/IOptions";
import {InvalidClientError} from "../common/errors/invalidClientError";
import {InvalidRequestError} from "../common/errors/invalidRequestError";
import {ServerError} from "../common/errors/serverError";
import {GrantType} from "../common/enums";
import {IBaseModel} from "../interfaces/IModel";

@define()
@singleton()
export class ClientHandler {

    @inject() options: IOptions;

    public async getClient(params: { clientId: string, clientSecret: string}): Promise<IClient> {

        if (!params.clientId || !params.clientSecret) {
            throw new InvalidRequestError("Invalid params: invalid clientId or clientSecret");
        }

        let client = await this._getClientFromModel(params.clientId, params.clientSecret);

        if (!client) {
            throw new InvalidClientError("Invalid client: client is invalid")
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
