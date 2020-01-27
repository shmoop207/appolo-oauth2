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
const insufficientScopeError_1 = require("./src/common/errors/insufficientScopeError");
exports.InsufficientScopeError = insufficientScopeError_1.InsufficientScopeError;
const invalidClientError_1 = require("./src/common/errors/invalidClientError");
exports.InvalidClientError = invalidClientError_1.InvalidClientError;
const invalidGrantError_1 = require("./src/common/errors/invalidGrantError");
exports.InvalidGrantError = invalidGrantError_1.InvalidGrantError;
const invalidRequestError_1 = require("./src/common/errors/invalidRequestError");
exports.InvalidRequestError = invalidRequestError_1.InvalidRequestError;
const invalidScopeError_1 = require("./src/common/errors/invalidScopeError");
exports.InvalidScopeError = invalidScopeError_1.InvalidScopeError;
const invalidTokenError_1 = require("./src/common/errors/invalidTokenError");
exports.InvalidTokenError = invalidTokenError_1.InvalidTokenError;
const serverError_1 = require("./src/common/errors/serverError");
exports.ServerError = serverError_1.ServerError;
const unauthorizedClientError_1 = require("./src/common/errors/unauthorizedClientError");
exports.UnauthorizedClientError = unauthorizedClientError_1.UnauthorizedClientError;
const unauthorizedRequestError_1 = require("./src/common/errors/unauthorizedRequestError");
exports.UnauthorizedRequestError = unauthorizedRequestError_1.UnauthorizedRequestError;
async function createOAuth2Server(options) {
    let app = appolo_engine_1.createApp({ root: __dirname });
    app.injector.addObject("options", Object.assign({}, defaults_1.Defaults, options));
    await app.launch();
    let server = app.injector.get(oAuth2Server_1.OAuth2Server, [options]);
    return server;
}
exports.createOAuth2Server = createOAuth2Server;
//# sourceMappingURL=index.js.map