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
        let token, model = this.options.model;
        if (model.generateAccessToken) {
            token = await model.generateAccessToken(opts.client, opts.user, opts.scopes);
        }
        return token || appolo_utils_1.Guid.guid();
    }
    async generateRefreshToken(opts) {
        let token, model = this.options.model;
        if (model.generateRefreshToken) {
            token = await model.generateRefreshToken(opts.client, opts.user, opts.scopes);
        }
        return token || appolo_utils_1.Guid.guid();
    }
    getAccessTokenLifetime(accessTokenLifetime, client) {
        return (accessTokenLifetime || client.accessTokenLifetime || this.options.accessTokenLifetime);
    }
    getRefreshTokenLifetime(refreshTokenLifetime, client) {
        return (refreshTokenLifetime || client.refreshTokenLifetime || this.options.refreshTokenLifetime);
    }
    getAccessTokenExpiresAt(accessTokenLifetime, client) {
        let tokenLifeTime = this.getAccessTokenLifetime(accessTokenLifetime, client);
        return this.getExpireDate(tokenLifeTime);
    }
    getRefreshTokenExpiresAt(refreshTokenLifetime, client) {
        let tokenLifeTime = this.getRefreshTokenLifetime(refreshTokenLifetime, client);
        return this.getExpireDate(tokenLifeTime);
    }
    getExpireDate(tokenLifeTime) {
        let expires = new Date();
        expires.setSeconds(expires.getSeconds() + tokenLifeTime);
        return expires;
    }
    async createTokens(opts) {
        let [token, refreshToken] = await Promise.all([
            this._createAccessToken(opts),
            this.options.useRefreshToken && this.createRefreshToken(opts)
        ]);
        (this.options.bumpLifeTime) && (token.accessTokenLifetime = this.getAccessTokenLifetime(opts.accessTokenLifetime, opts.client));
        if (this.options.useRefreshToken) {
            token.refreshTokenExpiresAt = refreshToken.refreshTokenExpiresAt;
            token.refreshToken = refreshToken.refreshToken;
            if (this.options.bumpLifeTime) {
                token.refreshTokenLifetime = refreshToken.refreshTokenLifetime = this.getRefreshTokenLifetime(opts.refreshTokenLifetime, opts.client);
            }
        }
        [token, refreshToken] = await this.saveTokens(token, refreshToken, opts.client, opts.user);
        token = await this.authenticateHandler.getToken({ token: token.accessToken, scope: opts.scopes });
        return token;
    }
    saveTokens(token, refreshToken, client, user) {
        return Promise.all([
            this.saveAccessToken(token, client, user),
            this.options.useRefreshToken && this.saveTokenRefresh(refreshToken, client, user)
        ]);
    }
    async _createAccessToken(opts) {
        let accessToken = await this.generateAccessToken(opts);
        let token = {
            accessToken: accessToken,
            accessTokenExpiresAt: this.getAccessTokenExpiresAt(opts.accessTokenLifetime, opts.client),
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
            refreshTokenExpiresAt: this.getRefreshTokenExpiresAt(opts.refreshTokenLifetime, opts.client),
            user: opts.user
        };
        return token;
    }
    async saveAccessToken(token, client, user) {
        let promise = this.options.model.saveAccessToken(Object.assign({}, token), Object.assign({}, client), Object.assign({}, user));
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
        let promise = this.options.model.saveRefreshToken(Object.assign({}, token), Object.assign({}, client), Object.assign({}, user));
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
        let model = this.options.model;
        let promise = model.revokeRefreshToken(token);
        let [err, result] = await appolo_utils_2.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!result) {
            throw new invalidGrantError_1.InvalidGrantError('Invalid grant: failed to revoke token');
        }
    }
    async revokeAccessToken(token) {
        let model = this.options.model;
        let promise = model.revokeAccessToken(token);
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
], TokensHelper.prototype, "options", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokensHelper.prototype, "clientHandler", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], TokensHelper.prototype, "authenticateHandler", void 0);
TokensHelper = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton()
], TokensHelper);
exports.TokensHelper = TokensHelper;
//# sourceMappingURL=tokensHelper.js.map