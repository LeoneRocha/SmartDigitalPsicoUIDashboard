import { TokenAuth } from "../general/TokenAuth"
import { RoleGroupModel } from "../simplemodel/RoleGroupModel"

export interface UserAutenticateModel {
  id: number
  name: string
  language: string
  tokenAuth: TokenAuth
  roleGroups: RoleGroupModel[]
  medicalId?: number
}
