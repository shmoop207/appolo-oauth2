"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuth2Server = exports.UnauthorizedRequestError = exports.UnauthorizedClientError = exports.ServerError = exports.InvalidTokenError = exports.InvalidScopeError = exports.InvalidRequestError = exports.InvalidGrantError = exports.InvalidClientError = exports.InsufficientScopeError = exports.Utils = exports.GrantType = exports.OAuth2Server = void 0;
const enums_1 = require("./src/common/enums");
Object.defineProperty(exports, "GrantType", { enumerable: true, get: function () { return enums_1.GrantType; } });
const engine_1 = require("@appolo/engine");
const defaults_1 = require("./src/common/defaults");
const oAuth2Server_1 = require("./src/oAuth2Server");
Object.defineProperty(exports, "OAuth2Server", { enumerable: true, get: function () { return oAuth2Server_1.OAuth2Server; } });
const utils_1 = require("./src/utils/utils");
Object.defineProperty(exports, "Utils", { enumerable: true, get: function () { return utils_1.Utils; } });
const insufficientScopeError_1 = require("./src/common/errors/insufficientScopeError");
Object.defineProperty(exports, "InsufficientScopeError", { enumerable: true, get: function () { return insufficientScopeError_1.InsufficientScopeError; } });
const invalidClientError_1 = require("./src/common/errors/invalidClientError");
Object.defineProperty(exports, "InvalidClientError", { enumerable: true, get: function () { return invalidClientError_1.InvalidClientError; } });
const invalidGrantError_1 = require("./src/common/errors/invalidGrantError");
Object.defineProperty(exports, "InvalidGrantError", { enumerable: true, get: function () { return invalidGrantError_1.InvalidGrantError; } });
const invalidRequestError_1 = require("./src/common/errors/invalidRequestError");
Object.defineProperty(exports, "InvalidRequestError", { enumerable: true, get: function () { return invalidRequestError_1.InvalidRequestError; } });
const invalidScopeError_1 = require("./src/common/errors/invalidScopeError");
Object.defineProperty(exports, "InvalidScopeError", { enumerable: true, get: function () { return invalidScopeError_1.InvalidScopeError; } });
const invalidTokenError_1 = require("./src/common/errors/invalidTokenError");
Object.defineProperty(exports, "InvalidTokenError", { enumerable: true, get: function () { return invalidTokenError_1.InvalidTokenError; } });
const serverError_1 = require("./src/common/errors/serverError");
Object.defineProperty(exports, "ServerError", { enumerable: true, get: function () { return serverError_1.ServerError; } });
const unauthorizedClientError_1 = require("./src/common/errors/unauthorizedClientError");
Object.defineProperty(exports, "UnauthorizedClientError", { enumerable: true, get: function () { return unauthorizedClientError_1.UnauthorizedClientError; } });
const unauthorizedRequestError_1 = require("./src/common/errors/unauthorizedRequestError");
Object.defineProperty(exports, "UnauthorizedRequestError", { enumerable: true, get: function () { return unauthorizedRequestError_1.UnauthorizedRequestError; } });
async function createOAuth2Server(options) {
    let app = engine_1.createApp({ root: __dirname });
    app.injector.addObject("options", Object.assign({}, defaults_1.Defaults, options));
    await app.launch();
    let server = app.injector.get(oAuth2Server_1.OAuth2Server, [options]);
    return server;
}
exports.createOAuth2Server = createOAuth2Server;
//# sourceMappingURL=index.js.map