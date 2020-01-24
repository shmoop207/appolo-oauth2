import {IToken} from "./IToken";
import {IClient} from "./IClient";

export interface IGrantParams {
    username?: string,
    password?: string,
    refreshToken?: string
    scope?: string[],
    client: IClient
}

export interface IGrantHandler {
    handle(params: IGrantParams): Promise<IToken>
}
