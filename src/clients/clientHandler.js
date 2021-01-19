"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientHandler = void 0;
const tslib_1 = require("tslib");
const inject_1 = require("@appolo/inject");
const invalidClientError_1 = require("../common/errors/invalidClientError");
const invalidRequestError_1 = require("../common/errors/invalidRequestError");
const serverError_1 = require("../common/errors/serverError");
const unauthorizedClientError_1 = require("../common/errors/unauthorizedClientError");
let ClientHandler = class ClientHandler {
    async getClient(params) {
        if (!params.clientId || !params.clientSecret) {
            throw new invalidRequestError_1.InvalidRequestError("Invalid params: invalid clientId or clientSecret");
        }
        let client = await this._getClientFromModel(params.clientId, params.clientSecret);
        if (!client) {
            throw new invalidClientError_1.InvalidClientError("Invalid client: client is invalid");
        }
        if (!client.grants || !Array.isArray(client.grants)) {
            throw new serverError_1.ServerError("Server error: `grants` must be an array");
        }
        if (!client.grants.includes(params.grantType)) {
            throw new unauthorizedClientError_1.UnauthorizedClientError('Unauthorized client: `grant_type` is invalid');
        }
        if (params.scope && client.scopes && client.scopes.length && !params.scope.every(scope => client.scopes.includes(scope))) {
            throw new unauthorizedClientError_1.UnauthorizedClientError('Unauthorized client: `scope` is invalid');
        }
        return client;
    }
    async _getClientFromModel(clientId, clientSecret) {
        try {
            let client = await this.options.model.getClient(clientId, clientSecret);
            return client;
        }
        catch (e) {
            throw new invalidClientError_1.InvalidClientError(`Invalid client: ${(e || "").toString()}`);
        }
    }
};
tslib_1.__decorate([
    inject_1.inject()
], ClientHandler.prototype, "options", void 0);
ClientHandler = tslib_1.__decorate([
    inject_1.define(),
    inject_1.singleton()
], ClientHandler);
exports.ClientHandler = ClientHandler;
//# sourceMappingURL=clientHandler.js.map