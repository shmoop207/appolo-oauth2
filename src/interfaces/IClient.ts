export interface IClient {
    id: string;
    redirectUris?: string | string[];
    grants:  string[];
    accessTokenLifetime?: number;
    refreshTokenLifetime?: number;
    scopes?: string[];
    [key: string]: any;
}
