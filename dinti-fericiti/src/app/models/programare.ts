import { CalendarEvent } from 'angular-calendar';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { Observable } from 'rxjs';

export interface Programare extends CalendarEvent{
  id: string;
  namePacient: string;
  phonePacient: number;
  emailPacient: string;
  consimtamant: boolean; // this will be a checkbox
  imgConsimtamant: Observable<string | null>; // this. will be the uploaded file for consent
  title: string;
  medic: string;
  start: Date;
  end: Date;
}
