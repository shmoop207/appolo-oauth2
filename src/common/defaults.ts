import {IOptions} from "../interfaces/IOptions";


export const Defaults = <Partial<IOptions>>{
    accessTokenLifetime: 1000 * 60 * 60,
    refreshTokenLifetime: 1000 * 60 * 60 * 2,
    useRefreshToken: true
}










