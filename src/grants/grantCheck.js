"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo_engine_1 = require("appolo-engine");
const invalidRequestError_1 = require("../common/errors/invalidRequestError");
const serverError_1 = require("../common/errors/serverError");
const enums_1 = require("../common/enums");
const unauthorizedClientError_1 = require("../common/errors/unauthorizedClientError");
let GrantCheck = class GrantCheck {
    checkGrant(params) {
        let { client } = params;
        if (!params.grantType) {
            throw new invalidRequestError_1.InvalidRequestError("Invalid params: grant_type` is invalid");
        }
        if (!enums_1.GrantType[params.grantType]) {
            throw new invalidRequestError_1.InvalidRequestError('Unsupported grant type: `grant_type` is invalid');
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
    }
};
GrantCheck = tslib_1.__decorate([
    appolo_engine_1.define(),
    appolo_engine_1.singleton()
], GrantCheck);
exports.GrantCheck = GrantCheck;
//# sourceMappingURL=grantCheck.js.map