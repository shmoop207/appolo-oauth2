"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedRequestError = void 0;
class UnauthorizedRequestError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, UnauthorizedRequestError.prototype);
        this.message = message;
        this.code = 401;
        this.name = 'unauthorized_request';
    }
}
exports.UnauthorizedRequestError = UnauthorizedRequestError;
//# sourceMappingURL=unauthorizedRequestError.js.map