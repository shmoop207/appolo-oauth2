"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerError extends Error {
    constructor(message) {
        super();
        Object.setPrototypeOf(this, ServerError.prototype);
        this.message = message;
        this.code = 500;
        this.name = 'server_error';
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=ServerError.js.map