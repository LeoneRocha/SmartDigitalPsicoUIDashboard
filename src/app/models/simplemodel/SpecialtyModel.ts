import { SimpleModel } from "../contracts/SimpleModel";

export interface SpecialtyModel extends SimpleModel {
    selected?: boolean;
}