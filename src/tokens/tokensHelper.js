"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
const appolo_utils_1 = require("appolo-utils");
const serverError_1 = require("../common/errors/serverError");
const appolo_utils_2 = require("appolo-utils");
const invalidGrantError_1 = require("../common/errors/invalidGrantError");
let TokensHelper = class TokensHelper {
    async generateAccessToken(opts) {
        let token, model = this.moduleOptions.model;
        if (model.generateAccessToken) {
            token = await model.generateAccessToken(opts.client, opts.user, opts.scopes);
        }
        return token || appolo_utils_1.Guid.guid();
    }
    async generateRefreshToken(opts) {
        let token, model = this.moduleOptions.model;
        if (model.generateRefreshToken) {
            token = await model.generateRefreshToken(opts.client, opts.user, opts.scopes);
        }
        return token || appolo_utils_1.Guid.guid();
    }
    getAccessTokenExpiresAt(client) {
        let tokenLifeTime = (client.accessTokenLifetime || this.moduleOptions.accessTokenLifetime);
        return this._getExpireDate(tokenLifeTime);
    }
    getRefreshTokenExpiresAt(client) {
        let tokenLifeTime = (client.refreshTokenLifetime || this.moduleOptions.refreshTokenLifetime);
        return this._getExpireDate(tokenLifeTime);
    }
    _getExpireDate(tokenLifeTime) {
        let expires = new Date();
        expires.setSeconds(expires.getSeconds() + tokenLifeTime);
        return expires;
    }
    async createTokens(opts) {
        let [token, refreshToken] = await Promise.all([
            this._createAccessToken(opts),
            this.moduleOptions.useRefreshToken && this.createRefreshToken(opts)
        ]);
        if (this.moduleOptions.useRefreshToken) {
            token.refreshTokenExpiresAt = refreshToken.refreshTokenExpiresAt;
            token.refreshToken = refreshToken.refreshToken;
        }
        [token, refreshToken] = await Promise.all([
            this.saveToken(token, opts.client, opts.user),
            this.moduleOptions.useRefreshToken && this.saveTokenRefresh(refreshToken, opts.client, opts.user)
        ]);
        return token;
    }
    async _createAccessToken(opts) {
        let accessToken = await this.generateAccessToken(opts);
        let token = {
            accessToken: accessToken,
            accessTokenExpiresAt: this.getAccessTokenExpiresAt(opts.client),
            client: opts.client,
            scope: opts.scopes,
            user: opts.user
        };
        return token;
    }
    async createRefreshToken(opts) {
        let refreshToken = await this.generateRefreshToken(opts);
        let token = {
            client: opts.client,
            scope: opts.scopes,
            refreshToken: refreshToken,
            refreshTokenExpiresAt: this.getRefreshTokenExpiresAt(opts.client),
            user: opts.user
        };
        return token;
    }
    async saveToken(token, client, user) {
        let promise = this.moduleOptions.model.saveToken(token, client, user);
        let [err, validToken] = await appolo_utils_2.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!validToken) {
            throw new serverError_1.ServerError(`server error: failed to save token}`);
        }
        return validToken;
    }
    async saveTokenRefresh(token, client, user) {
        let promise = this.moduleOptions.model.saveRefreshToken(token, client, user);
        let [err, validToken] = await appolo_utils_2.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!validToken) {
            throw new serverError_1.ServerError(`server error: failed to save refresh token}`);
        }
        return validToken;
    }
    async revokeRefreshToken(token) {
        let model = this.moduleOptions.model;
        let promise = model.revokeRefreshToken(token);
        let [err, result] = await appolo_utils_2.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!result) {
            throw new invalidGrantError_1.InvalidGrantError('Invalid grant: failed to revoke token');
        }
    }
    async revokeToken(token) {
        let model = this.moduleOptions.model;
        let promise = model.revokeToken(token);
        let [err, result] = await appolo_utils_2.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!result) {
            throw new invalidGrantError_1.InvalidGrantError('Invalid grant: failed to token');
        }
    }
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokensHelper.prototype, "moduleOptions", void 0);
TokensHelper = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton()
], TokensHelper);
exports.TokensHelper = TokensHelper;
//# sourceMappingURL=tokensHelper.js.map