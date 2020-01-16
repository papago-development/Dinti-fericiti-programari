import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  /**
   *
   */
  constructor() {
    super();
  }

  day(event: CalendarEvent): string {
    return `${event.title} - ${event. namePacient}`;
  }

  week(event: CalendarEvent): string {
    return `${event.title} - ${event.namePacient}`;
  }
}
