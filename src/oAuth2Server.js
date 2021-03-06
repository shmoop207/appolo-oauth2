"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Server = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let OAuth2Server = class OAuth2Server {
    _initialize() {
    }
    authenticate(params) {
        return this.authenticateHandler.getToken(params);
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
    inject_1.inject()
], OAuth2Server.prototype, "tokenHandler", void 0);
tslib_1.__decorate([
    inject_1.inject()
], OAuth2Server.prototype, "authenticateHandler", void 0);
tslib_1.__decorate([
    inject_1.inject()
], OAuth2Server.prototype, "passwordGruntHandler", void 0);
tslib_1.__decorate([
    inject_1.inject()
], OAuth2Server.prototype, "refreshGrantHandler", void 0);
tslib_1.__decorate([
    inject_1.init()
], OAuth2Server.prototype, "_initialize", null);
OAuth2Server = tslib_1.__decorate([
    inject_1.define()
], OAuth2Server);
exports.OAuth2Server = OAuth2Server;
//# sourceMappingURL=oAuth2Server.js.map