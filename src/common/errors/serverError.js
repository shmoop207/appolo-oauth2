"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerError extends Error {
    constructor(message, err) {
        super();
        Object.setPrototypeOf(this, ServerError.prototype);
        this.message = message;
        this.code = 500;
        this.name = 'server_error';
        this.inner = err;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=serverError.js.map