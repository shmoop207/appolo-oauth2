export class Utils {
    public static getTokenFromBearer(authorization: string): string {
        return authorization.split("Bearer ")[1];
    }

    public static parseAuthorization(authorization: string): { name: string, pass: string } {
        if (typeof authorization !== 'string') {
            return undefined
        }

        let match = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/.exec(authorization);

        if (!match) {
            return undefined
        }


        let userPass = /^([^:]*):(.*)$/.exec(Buffer.from(match[1], 'base64').toString());

        if (!userPass) {
            return undefined
        }


        return {name: userPass[1], pass: userPass[2]}
    }
}
