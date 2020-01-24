"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=UnauthorizedClientError.js.map