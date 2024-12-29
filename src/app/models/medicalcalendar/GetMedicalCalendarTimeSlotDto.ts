import { GetMedicalCalendarDtoBase } from './GetMedicalCalendarDtoBase';
import { GetMedicalDto } from '../modelsbyswagger/getMedicalDto';
import { GetPatientDto } from '../modelsbyswagger/getPatientDto';
import { HyperMediaLink } from '../modelsbyswagger/hyperMediaLink';

export interface GetMedicalCalendarTimeSlotDto extends GetMedicalCalendarDtoBase {
  tokenRecurrence: string;
  patientId?: number;
  patientName: string;
  medical: GetMedicalDto;
  patient?: GetPatientDto;
  links: HyperMediaLink[];
}
