export interface CalendarCriteriaDtoBase {
    medicalId: number;
    month: number;
    year: number;
    userIdLogged: number;
    startDate?: Date;
    endDate?: Date;
  }