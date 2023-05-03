import { SimpleModel } from "../contracts/SimpleModel"
export interface ApplicationLanguageModel extends SimpleModel {
    languageKey: string;
    languageValue: string;
    resourceKey : string;
}