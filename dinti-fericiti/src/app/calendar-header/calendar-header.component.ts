import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DAYS_OF_WEEK } from 'angular-calendar';


@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css']
})
export class CalendarHeaderComponent implements OnInit {

  // Properties
  @Input() view: string;
  @Input() viewDate: Date;
  @Input() locale: string = 'en';
  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
