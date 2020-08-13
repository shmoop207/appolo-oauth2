"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedClientError = void 0;
class UnauthorizedClientError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, UnauthorizedClientError.prototype);
        this.message = message;
        this.code = 400;
        this.name = 'unauthorized_client';
    }
}
exports.UnauthorizedClientError = UnauthorizedClientError;
//# sourceMappingURL=unauthorizedClientError.js.map