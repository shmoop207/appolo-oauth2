"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidClientError = void 0;
class InvalidClientError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, InvalidClientError.prototype);
        this.message = message;
        this.code = 400;
        this.name = 'invalid_client';
    }
}
exports.InvalidClientError = InvalidClientError;
//# sourceMappingURL=invalidClientError.js.map