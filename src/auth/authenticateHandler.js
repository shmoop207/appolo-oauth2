"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
const appolo_utils_1 = require("appolo-utils");
const serverError_1 = require("../common/errors/serverError");
const invalidTokenError_1 = require("../common/errors/invalidTokenError");
const unauthorizedRequestError_1 = require("../common/errors/unauthorizedRequestError");
const insufficientScopeError_1 = require("../common/errors/insufficientScopeError");
let AuthenticateHandler = class AuthenticateHandler {
    async getToken(opts) {
        if (!opts.token) {
            throw new unauthorizedRequestError_1.UnauthorizedRequestError('Unauthorized request: no authentication given');
        }
        let accessToken = await this._getToken(opts);
        this._validateToken(accessToken);
        await this._verifyScope(accessToken, this.options.scopes);
        this._validateTokenScope(accessToken, opts.scope);
        if (this.options.bumpLifeTime) {
            await this._bumpLifetime(accessToken);
        }
        return accessToken;
    }
    _validateTokenScope(token, scope) {
        if (scope && scope.length && token.scope && !scope.every(s => token.scope.includes(s))) {
            throw new insufficientScopeError_1.InsufficientScopeError('Insufficient scope: authorized scope is insufficient');
        }
        return true;
    }
    async _getToken(opts) {
        let promise = this.options.model.getAccessToken(opts.token);
        let [err, accessToken] = await appolo_utils_1.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError('Server error: `failed to get token');
        }
        if (!accessToken) {
            throw new invalidTokenError_1.InvalidTokenError('Invalid token: access token is invalid');
        }
        return accessToken;
    }
    async _verifyScope(token, scopes) {
        if (!scopes || !scopes.length) {
            return;
        }
        let promise = this.options.model.verifyScope(token, scopes);
        let [err, result] = await appolo_utils_1.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError('Server error: `failed to` must be a Date instance');
        }
        if (!result) {
            throw new insufficientScopeError_1.InsufficientScopeError('Insufficient scope: authorized scope is insufficient');
        }
    }
    _validateToken(accessToken) {
        if (!(accessToken.accessTokenExpiresAt instanceof Date)) {
            throw new serverError_1.ServerError('Server error: `accessTokenExpiresAt` must be a Date instance');
        }
        if (accessToken.accessTokenExpiresAt < new Date()) {
            throw new invalidTokenError_1.InvalidTokenError('Invalid token: access token has expired');
        }
    }
    async _bumpLifetime(token) {
        if (!token.accessTokenLifetime) {
            return token;
        }
        let newAccessTokenLifetime = this.tokensHelper.getExpireDate(token.accessTokenLifetime);
        let diff = Date.now() - token.accessTokenExpiresAt.getTime();
        if (diff >= (this.options.bumpLifeTimeMinDiff * 1000)) {
            token.accessTokenLifetime && (token.accessTokenExpiresAt = newAccessTokenLifetime);
            token.refreshTokenLifetime && (token.refreshTokenExpiresAt = this.tokensHelper.getExpireDate(token.refreshTokenLifetime));
            [token] = await this.tokensHelper.saveTokens(token, token, token.client, token.user);
        }
        return token;
    }
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], AuthenticateHandler.prototype, "options", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], AuthenticateHandler.prototype, "tokensHelper", void 0);
AuthenticateHandler = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton()
], AuthenticateHandler);
exports.AuthenticateHandler = AuthenticateHandler;
//# sourceMappingURL=authenticateHandler.js.map