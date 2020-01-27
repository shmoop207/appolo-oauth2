import {define, inject, singleton, injectAlias} from "appolo-engine";
import {ICreateTokenParams} from "../interfaces/ICreateTokenParams";
import {IToken} from "../interfaces/IToken";
import {IOptions} from "../interfaces/IOptions";
import {ClientHandler} from "../clients/clientHandler";
import {IGrantHandler} from "../interfaces/IGrantHandler";
import {GrantType} from "../common/enums";
import {AuthenticateHandler} from "../auth/authenticateHandler";
import {TokensHelper} from "./tokensHelper";

@define()
@singleton()
export class TokenHandler {

    @inject() options: IOptions;
    @inject() authenticateHandler: AuthenticateHandler;
    @inject() tokensHelper: TokensHelper;


    public async revokeToken(token: string): Promise<void> {
        let accessToken = await this.authenticateHandler.getToken({token});

        await Promise.all([this.tokensHelper.revokeAccessToken(accessToken),
            (accessToken.refreshToken) && this.tokensHelper.revokeRefreshToken(accessToken)])


    }


}
