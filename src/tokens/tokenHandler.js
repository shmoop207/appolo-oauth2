"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenHandler = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
let TokenHandler = class TokenHandler {
    async revokeToken(token) {
        let accessToken = await this.authenticateHandler.getToken({ token });
        await Promise.all([this.tokensHelper.revokeAccessToken(accessToken),
            (accessToken.refreshToken) && this.tokensHelper.revokeRefreshToken(accessToken)]);
    }
};
tslib_1.__decorate([
    inject_1.inject()
], TokenHandler.prototype, "options", void 0);
tslib_1.__decorate([
    inject_1.inject()
], TokenHandler.prototype, "authenticateHandler", void 0);
tslib_1.__decorate([
    inject_1.inject()
], TokenHandler.prototype, "tokensHelper", void 0);
TokenHandler = tslib_1.__decorate([
    inject_1.define(),
    inject_1.singleton()
], TokenHandler);
exports.TokenHandler = TokenHandler;
//# sourceMappingURL=tokenHandler.js.map