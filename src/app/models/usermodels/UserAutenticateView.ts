import { RoleGroupModel } from "../simplemodel/RoleGroupModel"

 
export interface UserAutenticateView {
  id: number 
  language: string
  name: string 
  roleGroups: RoleGroupModel[]
  medicalId?: number
  }

