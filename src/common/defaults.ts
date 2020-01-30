import {IOptions} from "../interfaces/IOptions";


export const Defaults = <Partial<IOptions>>{
    accessTokenLifetime: 60 * 60,
    refreshTokenLifetime: 60 * 60 * 2,
    bumpLifeTimeMinDiff: 60 * 10,
    useRefreshToken: true
}










