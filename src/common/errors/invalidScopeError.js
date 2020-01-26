"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidScopeError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, InvalidScopeError.prototype);
        this.message = message;
        this.code = 400;
        this.name = 'invalid_scope';
    }
}
exports.InvalidScopeError = InvalidScopeError;
//# sourceMappingURL=invalidScopeError.js.map