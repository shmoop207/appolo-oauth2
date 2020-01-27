import {define, inject, initMethod} from 'appolo-engine';
import * as _ from "lodash";
import {Promises} from "appolo-utils";
import {EventDispatcher} from "appolo-event-dispatcher";
import {ICreateTokenParams} from "./interfaces/ICreateTokenParams";
import {IToken} from "./interfaces/IToken";
import {TokenHandler} from "./tokens/tokenHandler";
import {AuthenticateHandler} from "./auth/authenticateHandler";
import {PasswordGruntHandler} from "./grants/passwordGrantHandler";
import {RefreshGrantHandler} from "./grants/refreshGrantHandler";

@define()
export class OAuth2Server {

    @inject() private tokenHandler: TokenHandler;
    @inject() private authenticateHandler: AuthenticateHandler;
    @inject() private passwordGruntHandler: PasswordGruntHandler;
    @inject() private refreshGrantHandler: RefreshGrantHandler;

    @initMethod()
    private _initialize() {

    }

    public authenticate(token: string): Promise<IToken> {
        return this.authenticateHandler.getToken({token})
    }

    public login(params: { clientId: string, clientSecret: string, username: string, password: string, scope: string[] }): Promise<IToken> {
        return this.passwordGruntHandler.createToken(params)
    }

    public refreshToken(params: { clientId: string, clientSecret: string, refreshToken: string, scope: string[] }): Promise<IToken> {
        return this.refreshGrantHandler.refreshToken(params)
    }

    public revokeToken(token: string): Promise<void> {
        return this.tokenHandler.revokeToken(token)
    }
}
