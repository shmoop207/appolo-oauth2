"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
let OAuth2Server = class OAuth2Server {
    _initialize() {
    }
    authenticate(token) {
        return this.authenticateHandler.getToken({ token });
    }
    login(params) {
        return this.passwordGruntHandler.createToken(params);
    }
    refreshToken(params) {
        return this.refreshGrantHandler.refreshToken(params);
    }
    revokeToken(token) {
        return this.tokenHandler.revokeToken(token);
    }
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], OAuth2Server.prototype, "tokenHandler", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], OAuth2Server.prototype, "authenticateHandler", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], OAuth2Server.prototype, "passwordGruntHandler", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], OAuth2Server.prototype, "refreshGrantHandler", void 0);
tslib_1.__decorate([
    appolo_engine_1.initMethod()
], OAuth2Server.prototype, "_initialize", null);
OAuth2Server = tslib_1.__decorate([
    appolo_engine_1.define()
], OAuth2Server);
exports.OAuth2Server = OAuth2Server;
//# sourceMappingURL=oAuth2Server.js.map