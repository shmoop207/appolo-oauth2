import {GrantType} from "../common/enums";

export interface ICreateTokenParams {
    clientId: string
    clientSecret: string
    username?: string
    password?: string
    refreshToken?: string
    grantType: GrantType
    scope: string[]
}
