import {IOptions} from "./src/interfaces/IOptions";
import {IClient} from "./src/interfaces/IClient";
import {IAuthenticationModel,IPasswordModel,IRefreshTokenModel} from "./src/interfaces/IModel";
import {App, createApp} from 'appolo-engine';
import {Defaults} from "./src/common/defaults";
import {OAuth2Server} from "./src/oAuth2Server";

export {
    IOptions,IClient,IRefreshTokenModel,IPasswordModel,IAuthenticationModel,OAuth2Server
}

export async function createOAuth2Server(options: IOptions) {
    let app = createApp({root: __dirname});

    app.injector.addObject("options", Object.assign({}, Defaults, options));

    await app.launch();

    let rabbit = app.injector.get<OAuth2Server>(OAuth2Server, [options]);

    return rabbit;
}
