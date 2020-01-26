"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static getTokenFromBearer(authorization) {
        return authorization.split("Bearer")[1];
    }
    static parseAuthorization(authorization) {
        if (typeof authorization !== 'string') {
            return undefined;
        }
        let match = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/.exec(authorization);
        if (!match) {
            return undefined;
        }
        let userPass = /^([^:]*):(.*)$/.exec(Buffer.from(match[1], 'base64').toString());
        if (!userPass) {
            return undefined;
        }
        return { name: userPass[1], pass: userPass[2] };
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map