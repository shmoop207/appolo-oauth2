import {define, inject, singleton} from "@appolo/inject";
import {IOptions} from "../interfaces/IOptions";
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
