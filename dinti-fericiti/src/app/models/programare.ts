import { CalendarEvent } from 'angular-calendar';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Programare extends CalendarEvent{
  id: string;
  namePacient: string;
  phonePacient: number;
  emailPacient: string;
  title: string;
  medic: string;
  start: Date;
  end: Date;
}
