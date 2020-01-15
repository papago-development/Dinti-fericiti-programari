import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LastAppointmentService {

  //Properties

  constructor(private db: AngularFirestore) { }

  addLastAppointment(lastAppointment) {
    return this.db.collection('UltimeleProgramari').add(lastAppointment);
  }
}
