"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidGrantError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, InvalidGrantError.prototype);
        this.message = message;
        this.code = 400;
        this.name = 'invalid_grant';
    }
}
exports.InvalidGrantError = InvalidGrantError;
//# sourceMappingURL=InvalidGrantError.js.map