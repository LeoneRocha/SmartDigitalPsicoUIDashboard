import { GetMedicalCalendarDtoBase } from './GetMedicalCalendarDtoBase';

export interface ActionMedicalCalendarDtoBase extends GetMedicalCalendarDtoBase {
  medicalId: number;
  patientId?: number;
  createdUserId?: number;
  modifyUserId?: number;
  updateSeries?: boolean;
  tokenRecurrence?: string;
}