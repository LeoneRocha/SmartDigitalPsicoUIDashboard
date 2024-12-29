import { ActionMedicalCalendarDtoBase } from './ActionMedicalCalendarDtoBase';

export interface UpdateMedicalCalendarDto extends ActionMedicalCalendarDtoBase {
  updateSeries: boolean;
  tokenRecurrence: string;
}