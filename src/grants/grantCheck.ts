// import {define, inject, singleton, initMethod} from "appolo-engine";
// import {IClient} from "../interfaces/IClient";
// import {InvalidRequestError} from "../common/errors/invalidRequestError";
// import {ServerError} from "../common/errors/serverError";
// import {GrantType} from "../common/enums";
// import {Enums, Arrays} from "appolo-utils";
// import {UnauthorizedClientError} from "../common/errors/unauthorizedClientError";
//
// @define()
// @singleton()
// export class GrantCheck {
//
//     private _grantTypes: { [index in GrantType]?: string } = {};
//
//     @initMethod()
//     private _initialize() {
//         this._grantTypes = Arrays.keyBy<any>(Enums.enumValues(GrantType), (item) => item);
//     }
//
//     public checkGrant(params: { client: IClient, grantType: GrantType, scope: string[] }): void {
//
//         let {client} = params;
//
//         if (!params.grantType) {
//             throw new InvalidRequestError("Invalid params: grant_type` is invalid");
//         }
//
//         if (!this._grantTypes[params.grantType]) {
//             throw new InvalidRequestError('Unsupported grant type: `grant_type` is invalid');
//         }
//
//
//
//
//     }
// }
