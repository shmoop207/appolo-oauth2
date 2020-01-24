"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
const invalidGrantError_1 = require("../common/errors/invalidGrantError");
const serverError_1 = require("../common/errors/serverError");
const invalidScopeError_1 = require("../common/errors/invalidScopeError");
const invalidRequestError_1 = require("../common/errors/invalidRequestError");
const appolo_utils_1 = require("appolo-utils");
let PasswordGruntHandler = class PasswordGruntHandler {
    async handle(params) {
        if (!params.username) {
            throw new invalidRequestError_1.InvalidRequestError('Missing parameter: `username`');
        }
        if (!params.password) {
            throw new invalidRequestError_1.InvalidRequestError('Missing parameter: `password`');
        }
        let { client } = params;
        let user = this._getUser(params.username, params.password);
        let scopes = await this._validateScope(user, client, params.scope);
        let token = await this.baseGrantHandler.createTokens({ user, client, scopes });
        return token;
    }
    async _getUser(username, password) {
        let promise = this.moduleOptions.model.getUser(username, password);
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
        let promise = this.moduleOptions.model.validateScope(user, client, scopes);
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
], PasswordGruntHandler.prototype, "moduleOptions", void 0);
tslib_1.__decorate([
    appolo_engine_1.inject()
], PasswordGruntHandler.prototype, "baseGrantHandler", void 0);
PasswordGruntHandler = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton(),
    appolo_engine_1.alias("IGrantHandler")
], PasswordGruntHandler);
exports.PasswordGruntHandler = PasswordGruntHandler;
//# sourceMappingURL=passwordGrantHandler.js.map