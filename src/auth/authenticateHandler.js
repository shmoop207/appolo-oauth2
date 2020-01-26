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
        let accessToken = await this._getToken(opts.token);
        this._validateToken(accessToken);
        await this._verifyScope(accessToken);
        return accessToken;
    }
    async _getToken(token) {
        let promise = this.options.model.getAccessToken(token);
        let [err, accessToken] = await appolo_utils_1.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError('Server error: `failed to get token');
        }
        if (!accessToken) {
            throw new invalidTokenError_1.InvalidTokenError('Invalid token: access token is invalid');
        }
        return accessToken;
    }
    async _verifyScope(token) {
        if (!this.options.scopes || !this.options.scopes.length) {
            return;
        }
        let promise = this.options.model.verifyScope(token, this.options.scopes);
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
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], AuthenticateHandler.prototype, "options", void 0);
AuthenticateHandler = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton()
], AuthenticateHandler);
exports.AuthenticateHandler = AuthenticateHandler;
//# sourceMappingURL=authenticateHandler.js.map