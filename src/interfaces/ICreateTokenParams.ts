import {GrantType} from "../common/enums";

export interface ICreateTokenParams {
    clientId: string
    clientSecret: string
    userName?: string
    userPassword?: string
    refreshToken?: string
    grantType: GrantType
    scope: string[]
}
