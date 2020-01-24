"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InsufficientScopeError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, InsufficientScopeError.prototype);
        this.message = message;
        this.code = 403;
        this.name = 'insufficient_scope';
    }
}
exports.InsufficientScopeError = InsufficientScopeError;
//# sourceMappingURL=insufficientScopeError.js.map