import {IOptions} from "./src/interfaces/IOptions";
import {GrantType} from "./src/common/enums";
import {IClient} from "./src/interfaces/IClient";
import {IUser} from "./src/interfaces/IUser";
import {IToken, IRefreshToken} from "./src/interfaces/IToken";
import {IAuthenticationModel, IPasswordModel, IRefreshTokenModel, Falsey} from "./src/interfaces/IModel";
import {App, createApp} from '@appolo/engine';
import {Defaults} from "./src/common/defaults";
import {OAuth2Server} from "./src/oAuth2Server";
import {Utils} from "./src/utils/utils";
import {InsufficientScopeError} from "./src/common/errors/insufficientScopeError";
import {InvalidClientError} from "./src/common/errors/invalidClientError";
import {InvalidGrantError} from "./src/common/errors/invalidGrantError";
import {InvalidRequestError} from "./src/common/errors/invalidRequestError";
import {InvalidScopeError} from "./src/common/errors/invalidScopeError";
import {InvalidTokenError} from "./src/common/errors/invalidTokenError";
import {ServerError} from "./src/common/errors/serverError";
import {UnauthorizedClientError} from "./src/common/errors/unauthorizedClientError";
import {UnauthorizedRequestError} from "./src/common/errors/unauthorizedRequestError";

export {
    IOptions,
    IClient,
    IRefreshTokenModel,
    IPasswordModel,
    IAuthenticationModel,
    OAuth2Server,
    Falsey,
    IUser,
    IToken,
    IRefreshToken,GrantType,Utils,InsufficientScopeError,InvalidClientError,InvalidGrantError,
    InvalidRequestError,InvalidScopeError,InvalidTokenError,ServerError,UnauthorizedClientError,UnauthorizedRequestError
}

export async function createOAuth2Server(options: IOptions): Promise<OAuth2Server> {
    let app = createApp({root: __dirname});

    app.injector.addObject("options", Object.assign({}, Defaults, options));

    await app.launch();

    let server = app.injector.get<OAuth2Server>(OAuth2Server, [options]);

    return server;
}
