"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=UnauthorizedRequestError.js.map