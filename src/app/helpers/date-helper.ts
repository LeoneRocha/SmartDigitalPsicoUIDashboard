import { DayCalendarDto } from "app/models/medicalcalendar/DayCalendarDto";
import * as moment from 'moment';

export class DateHelper {
    static getDayOfWeek(): string[] {
        const daysOfWeek = moment.weekdays();
        return daysOfWeek;
    }
    static newDateUTC(): Date {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();
        const dateActual = new Date(y, m, d, 0, 0, 0, 0);
        return dateActual;
    }
    static convertStringToDate(dateStr: string): Date {
        const parts = dateStr.split(/[-T:]/);
        return new Date(
            parseInt(parts[0], 10),   // year
            parseInt(parts[1], 10) - 1, // month (0-based)
            parseInt(parts[2], 10),   // day
            parseInt(parts[3], 10),   // hour
            parseInt(parts[4], 10),   // minute
            parseInt(parts[5], 10)    // second
        );
    }
    static sortTimeSlots(days: DayCalendarDto[]): DayCalendarDto[] {
        return days.map(day => {
            let timeIdCounter = 1;
            const sortedTimeSlots = day.timeSlots.sort((a, b) => {
                const aStartTime = moment.utc(a.startTime).toDate();
                const bStartTime = moment.utc(b.startTime).toDate();
                return aStartTime.getTime() - bStartTime.getTime();
            }).map(timeSlot => ({ ...timeSlot, timeId: timeIdCounter++ }));  // Atribui ID incremental
            return { ...day, timeSlots: sortedTimeSlots };
        });
    }
    private static addDayOfWeek(day: DayCalendarDto): DayCalendarDto {
        const dayIndex = moment(day.date).utc().day();
        const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        day.dayOfWeek = dayNames[dayIndex];
        return day;
    }
    static fillAddDayOfWeek(days: DayCalendarDto[]): DayCalendarDto[] {
        return days.map(day => this.addDayOfWeek(day));
    }
    static getUniqueWeekDays(days: DayCalendarDto[]): number[] {
        const uniqueDays = new Set<number>();
        days.forEach(day => {
            const dayIndex = moment(day.date).utc().day();
            uniqueDays.add(dayIndex);
        });
        return Array.from(uniqueDays).sort();
    }
    static getDayName(dayIndex: number): string {
        const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return dayNames[dayIndex];
    }
    static convertToLocalTime(date: any): Date {
        let dateConverted: Date = new Date();
        try {
            if (date instanceof Date) {
                dateConverted = moment(date.toUTCString()).local().toDate();
            } else if (typeof date === 'string') {
                dateConverted = DateHelper.convertStringToDate(date);
                dateConverted = moment(dateConverted).local().toDate();
            } else {
                throw new Error('Formato de data inválido');
            }
        } catch (error) {
            console.error('Erro ao converter data para horário local:', error);
        }
        return dateConverted;
    }

   static formatFullDate(date: Date, languageUI: string): string {
        return moment(date).locale(languageUI).format('dddd, D MMMM YYYY');
    }
}