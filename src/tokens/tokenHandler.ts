import {define, inject, singleton, injectAlias} from "appolo-engine";
import {ICreateTokenParams} from "../interfaces/ICreateTokenParams";
import {IToken} from "../interfaces/IToken";
import {IOptions} from "../interfaces/IOptions";
import {ClientHandler} from "../clients/clientHandler";
import {IGrantHandler} from "../interfaces/IGrantHandler";
import {GrantType} from "../common/enums";
import {GrantCheck} from "../grants/grantCheck";
import {AuthenticateHandler} from "../auth/authenticateHandler";
import {TokensHelper} from "./tokensHelper";

@define()
@singleton()
export class TokenHandler {

    @inject() moduleOptions: IOptions;
    @inject() clientHandler: ClientHandler;
    @inject() grantCheck: GrantCheck;
    @inject() authenticateHandler: AuthenticateHandler;
    @inject() tokensHelper: TokensHelper;

    @injectAlias("IGrantHandler", "TYPE") grantHandlers: { [index in GrantType]: IGrantHandler };

    public async createToken(params: ICreateTokenParams): Promise<IToken> {

        let client = await this.clientHandler.getClient({
            clientId: params.clientId,
            clientSecret: params.clientSecret
        });

        this.grantCheck.checkGrant({client, grantType: params.grantType, scope: params.scope});

        let handler = this.grantHandlers[params.grantType];

        let token = await handler.handle({...params, client});

        return token;
    }

    public async revokeToken(token:string):Promise<void>{
        let accessToken  = await this.authenticateHandler.getToken({token});

        await Promise.all([this.tokensHelper.revokeToken(accessToken),
            (accessToken.refreshToken) && this.tokensHelper.revokeRefreshToken(accessToken)])


    }



}
