import { ICalendarEvent } from "app/models/general/ICalendarEvent";

export class EventUtility {
  static generateEvents(): ICalendarEvent[] {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();

    return [
      {
        title: 'All Day Event',
        start: new Date(y, m, 1),
        className: 'event-default'
      },
      {
        id: 999,
        title: 'Repeating Event',
        start: new Date(y, m, d + 3, 6, 0),
        allDay: false,
        className: 'event-rose'
      },
      {
        title: 'Meeting',
        start: new Date(y, m, d - 1, 10, 30),
        allDay: false,
        className: 'event-green'
      },
      {
        title: 'Lunch',
        start: new Date(y, m, d + 7, 12, 0),
        end: new Date(y, m, d + 7, 14, 0),
        allDay: false,
        className: 'event-red'
      },
      {
        title: 'Md-pro Launch',
        start: new Date(y, m, d - 2, 12, 0),
        allDay: true,
        className: 'event-azure'
      },
      {
        title: 'Birthday Party',
        start: new Date(y, m, d + 1, 19, 0),
        end: new Date(y, m, d + 1, 22, 30),
        allDay: false,
        className: 'event-azure'
      },
      {
        title: 'Click for Creative Tim',
        start: new Date(y, m, 21),
        end: new Date(y, m, 22),
        url: 'https://www.creative-tim.com/',
        className: 'event-orange'
      },
      {
        title: 'Click for Google',
        start: new Date(y, m, 21),
        end: new Date(y, m, 22),
        url: 'https://www.creative-tim.com/',
        className: 'event-orange'
      }
    ];
  }
}
