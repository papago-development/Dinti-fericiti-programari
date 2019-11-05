import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap, map } from 'rxjs/operators';
import { colors } from '../models/colors';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private db: AngularFirestore) { }

  // Get appointments from firebase collection 'Programari'
  getAppointments() {
    return this.db.collection('Programari').valueChanges().pipe(
      // tap(events => console.log('Events', events)),
      map( events => events.map(event => {
        const data: any = event;
        // if (data.medic === 'Doctor 1') {
        //   data.color = colors.red;
        // }
        switch (data.medic) {
          case 'Doctor 1':
            data.color = colors.red;
            break;
          case 'Doctor 2':
            data.color = colors.yellow;
            break;
          default:
            break;
        }

        data.start = data.start.toDate();
        data.end = data.end.toDate();
        return data;
      }))
    );
  }

  // Add appointment to firebase collection 'Programari'
  addAppointmnet(appointment) {
    return this.db.collection('Programari').add(appointment);
  }

  // View appointments by id
  getAppointmentByDoctor(name) {
    return this.db.collection('Programari', ref => ref.where('medic', '==', name)).valueChanges().pipe(
      map(events => events.map(event => {
        const data: any = event;
        data.start = data.start.toDate();
        data.end = data.end.toDate();
        return data;
      }))
    );
  }
}
