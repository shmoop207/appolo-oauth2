import {define, inject, initMethod} from 'appolo-engine';
import * as _ from "lodash";
import {Promises} from "appolo-utils";
import {EventDispatcher} from "appolo-event-dispatcher";
import {ICreateTokenParams} from "./interfaces/ICreateTokenParams";
import {IToken} from "./interfaces/IToken";
import {TokenHandler} from "./tokens/tokenHandler";
import {AuthenticateHandler} from "./auth/authenticateHandler";

@define()
export class OAuth2Server extends EventDispatcher {

    @inject() private tokenHandler: TokenHandler;
    @inject() private authenticateHandler: AuthenticateHandler;

    @initMethod()
    private _initialize() {

    }

    public authenticate(token: string): Promise<IToken> {
        return this.authenticateHandler.getToken({token})
    }

    public token(params: ICreateTokenParams): Promise<IToken> {
        return this.tokenHandler.createToken(params)
    }

    public revokeToken(token:string):Promise<void>{
        return this.tokenHandler.revokeToken(token)
    }
}
