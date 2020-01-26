"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
let TokenHandler = class TokenHandler {
    async createToken(params) {
        let client = await this.clientHandler.getClient({
            clientId: params.clientId,
            clientSecret: params.clientSecret
        });
        this.grantCheck.checkGrant({ client, grantType: params.grantType, scope: params.scope });
        let handler = this.grantHandlers[params.grantType];
        let token = await handler.handle(Object.assign(Object.assign({}, params), { client }));
        return token;
    }
    async revokeToken(token) {
        let accessToken = await this.authenticateHandler.getToken({ token });
        await Promise.all([this.tokensHelper.revokeToken(accessToken),
            (accessToken.refreshToken) && this.tokensHelper.revokeRefreshToken(accessToken)]);
    }
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokenHandler.prototype, "options", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokenHandler.prototype, "clientHandler", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokenHandler.prototype, "grantCheck", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokenHandler.prototype, "authenticateHandler", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokenHandler.prototype, "tokensHelper", void 0);
tslib_1.__decorate([
    appolo_engine_1.injectAlias("IGrantHandler", "TYPE")
], TokenHandler.prototype, "grantHandlers", void 0);
TokenHandler = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton()
], TokenHandler);
exports.TokenHandler = TokenHandler;
//# sourceMappingURL=tokenHandler.js.map