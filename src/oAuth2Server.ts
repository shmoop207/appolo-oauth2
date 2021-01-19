import {define, inject, init} from '@appolo/inject';
import { ILoginParams, IRefreshParams} from "./interfaces/ITokenParams";
import {IToken} from "./interfaces/IToken";
import {TokenHandler} from "./tokens/tokenHandler";
import {AuthenticateHandler} from "./auth/authenticateHandler";
import {PasswordGruntHandler} from "./grants/passwordGrantHandler";
import {RefreshGrantHandler} from "./grants/refreshGrantHandler";
import {IAuthenticateParams} from "./interfaces/ITokenParams";

@define()
export class OAuth2Server {

    @inject() private tokenHandler: TokenHandler;
    @inject() private authenticateHandler: AuthenticateHandler;
    @inject() private passwordGruntHandler: PasswordGruntHandler;
    @inject() private refreshGrantHandler: RefreshGrantHandler;

    @init()
    private _initialize() {

    }

    public authenticate(params: IAuthenticateParams): Promise<IToken> {
        return this.authenticateHandler.getToken(params)
    }

    public login(params: ILoginParams): Promise<IToken> {
        return this.passwordGruntHandler.createToken(params)
    }

    public refreshToken(params: IRefreshParams): Promise<IToken> {
        return this.refreshGrantHandler.refreshToken(params)
    }

    public revokeToken(token: string): Promise<void> {
        return this.tokenHandler.revokeToken(token)
    }
}
