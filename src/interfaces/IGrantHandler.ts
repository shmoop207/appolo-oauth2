import {IToken} from "./IToken";
import {IClient} from "./IClient";
import {GrantType} from "../common/enums";

export interface IGrantParams {
    username?: string,
    password?: string,
    refreshToken?: string
    scope?: string[],
    client: IClient
}

export interface IGrantHandler {
    handle(params: IGrantParams): Promise<IToken>

    TYPE: GrantType
}
