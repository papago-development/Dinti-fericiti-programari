import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Programare {
  id?: number;
  namePacient: string;
  phonePacient: string;
  title: string;
  medic: string;
  cabinet: string;
  start: Date;
  end: Date;
}
