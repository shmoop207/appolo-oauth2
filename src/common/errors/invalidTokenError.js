"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenError = void 0;
class InvalidTokenError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
        this.message = message;
        this.code = 401;
        this.name = 'invalid_token';
    }
}
exports.InvalidTokenError = InvalidTokenError;
//# sourceMappingURL=invalidTokenError.js.map