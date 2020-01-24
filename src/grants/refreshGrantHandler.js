"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
const invalidGrantError_1 = require("../common/errors/invalidGrantError");
const serverError_1 = require("../common/errors/serverError");
const appolo_utils_1 = require("appolo-utils");
let RefreshGrantHandler = class RefreshGrantHandler {
    async handle(params) {
        let refreshToken = await this._getRefreshToken(params.refreshToken);
        this._validateToken(refreshToken);
        await this.baseGrantHandler.revokeRefreshToken(refreshToken);
        let token = await this.baseGrantHandler.createTokens({
            scopes: refreshToken.scope,
            client: params.client,
            user: refreshToken.user
        });
        return token;
    }
    _validateToken(token) {
        if (!token.client) {
            throw new serverError_1.ServerError('Server error: `getRefreshToken()` did not return a `client`');
        }
        if (!token.user) {
            throw new serverError_1.ServerError('Server error: `getRefreshToken()` did not return a `user`');
        }
        if (token.client.id !== token.id) {
            throw new invalidGrantError_1.InvalidGrantError('Invalid grant: refresh token is invalid');
        }
        if (token.refreshTokenExpiresAt && !(token.refreshTokenExpiresAt instanceof Date)) {
            throw new serverError_1.ServerError('Server error: `refreshTokenExpiresAt` must be a Date instance');
        }
        if (token.refreshTokenExpiresAt && token.refreshTokenExpiresAt < new Date()) {
            throw new invalidGrantError_1.InvalidGrantError('Invalid grant: refresh token has expired');
        }
    }
    async _getRefreshToken(token) {
        let promise = this.moduleOptions.model.getRefreshToken(token);
        let [err, refreshToken] = await appolo_utils_1.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!refreshToken) {
            throw new invalidGrantError_1.InvalidGrantError('Invalid grant: refresh token is invalid');
        }
        return refreshToken;
    }
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], RefreshGrantHandler.prototype, "moduleOptions", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], RefreshGrantHandler.prototype, "baseGrantHandler", void 0);
RefreshGrantHandler = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton(),
    appolo_engine_1.alias("IGrantHandler")
], RefreshGrantHandler);
exports.RefreshGrantHandler = RefreshGrantHandler;
//# sourceMappingURL=refreshGrantHandler.js.map