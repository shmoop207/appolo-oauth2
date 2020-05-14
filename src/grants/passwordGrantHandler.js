"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
const invalidGrantError_1 = require("../common/errors/invalidGrantError");
const serverError_1 = require("../common/errors/serverError");
const invalidScopeError_1 = require("../common/errors/invalidScopeError");
const invalidRequestError_1 = require("../common/errors/invalidRequestError");
const appolo_utils_1 = require("appolo-utils");
const enums_1 = require("../common/enums");
let PasswordGruntHandler = class PasswordGruntHandler {
    async createToken(params) {
        let { username, password, scope, clientSecret, clientId } = params;
        if (!username) {
            throw new invalidRequestError_1.InvalidRequestError('Missing parameter: `username`');
        }
        if (!password) {
            throw new invalidRequestError_1.InvalidRequestError('Missing parameter: `Password`');
        }
        let client = await this.clientHandler.getClient({ clientId, clientSecret, scope, grantType: enums_1.GrantType.Password });
        let user = await this._getUser(username, password);
        let scopes = await this._validateScope(user, client, scope);
        let token = await this.tokensHelper.createTokens({
            user,
            client,
            scopes,
            refreshTokenLifetime: params.refreshTokenLifetime,
            accessTokenLifetime: params.accessTokenLifetime,
            params: params.params
        });
        return token;
    }
    async _getUser(username, password) {
        let promise = this.options.model.getUser(username, password);
        let [err, user] = await appolo_utils_1.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!user) {
            throw new invalidGrantError_1.InvalidGrantError('Invalid grant: user credentials are invalid');
        }
        return user;
    }
    async _validateScope(user, client, scopes) {
        let promise = this.options.model.validateScope(user, client, scopes);
        let [err, validScopes] = await appolo_utils_1.Promises.to(promise);
        if (err) {
            throw new serverError_1.ServerError(`server error: ${(err || "").toString()}`);
        }
        if (!validScopes || !validScopes.length) {
            throw new invalidScopeError_1.InvalidScopeError('Invalid scope: Requested scope is invalid');
        }
        return validScopes;
    }
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], PasswordGruntHandler.prototype, "options", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], PasswordGruntHandler.prototype, "tokensHelper", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], PasswordGruntHandler.prototype, "clientHandler", void 0);
PasswordGruntHandler = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton(),
    appolo_engine_1.alias("IGrantHandler")
], PasswordGruntHandler);
exports.PasswordGruntHandler = PasswordGruntHandler;
//# sourceMappingURL=passwordGrantHandler.js.map