"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
const invalidClientError_1 = require("../common/errors/invalidClientError");
const invalidRequestError_1 = require("../common/errors/invalidRequestError");
let ClientHandler = class ClientHandler {
    async getClient(params) {
        if (!params.clientId || !params.clientSecret) {
            throw new invalidRequestError_1.InvalidRequestError("Invalid params: invalid clientId or clientSecret");
        }
        let client = await this._getClientFromModel(params.clientId, params.clientSecret);
        if (!client) {
            throw new invalidClientError_1.InvalidClientError("Invalid client: client is invalid");
        }
        return client;
    }
    async _getClientFromModel(clientId, clientSecret) {
        try {
            let client = await this.moduleOptions.model.getClient(clientId, clientSecret);
            return client;
        }
        catch (e) {
            throw new invalidClientError_1.InvalidClientError(`Invalid client: ${(e || "").toString()}`);
        }
    }
};
tslib_1.__decorate([
    appolo_engine_1.inject()
], ClientHandler.prototype, "moduleOptions", void 0);
ClientHandler = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton()
], ClientHandler);
exports.ClientHandler = ClientHandler;
//# sourceMappingURL=clientHandler.js.map