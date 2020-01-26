"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("./src/common/enums");
exports.GrantType = enums_1.GrantType;
const appolo_engine_1 = require("appolo-engine");
const defaults_1 = require("./src/common/defaults");
const oAuth2Server_1 = require("./src/oAuth2Server");
exports.OAuth2Server = oAuth2Server_1.OAuth2Server;
const utils_1 = require("./src/utils/utils");
exports.Utils = utils_1.Utils;
async function createOAuth2Server(options) {
    let app = appolo_engine_1.createApp({ root: __dirname });
    app.injector.addObject("options", Object.assign({}, defaults_1.Defaults, options));
    await app.launch();
    let server = app.injector.get(oAuth2Server_1.OAuth2Server, [options]);
    return server;
}
exports.createOAuth2Server = createOAuth2Server;
//# sourceMappingURL=index.js.map