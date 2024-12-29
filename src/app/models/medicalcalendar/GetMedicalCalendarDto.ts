import { HyperMediaLink } from '../modelsbyswagger/hyperMediaLink';
import { GetMedicalDto } from '../modelsbyswagger/getMedicalDto';
import { GetPatientDto } from '../modelsbyswagger/getPatientDto';
import { GetUserDto } from '../modelsbyswagger/getUserDto';
import { ActionMedicalCalendarDtoBase } from './ActionMedicalCalendarDtoBase';

export interface GetMedicalCalendarDto extends ActionMedicalCalendarDtoBase {
  medical: GetMedicalDto;
  patient?: GetPatientDto;
  createdUser?: GetUserDto;
  modifyUser?: GetUserDto;
  links: HyperMediaLink[];
}