import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Programare {
  id: string;
  namePacient: string;
  phonePacient: number;
  title: string;
  medic: string;
  cabinet: string;
  start: Date;
  end: Date;
}
