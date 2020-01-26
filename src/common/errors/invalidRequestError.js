"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidRequestError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, InvalidRequestError.prototype);
        this.message = message;
        this.code = 400;
        this.name = 'invalid_request';
    }
}
exports.InvalidRequestError = InvalidRequestError;
//# sourceMappingURL=invalidRequestError.js.map