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
    return this.db.collection('Programari').snapshotChanges().pipe(
      map( events => events.map(event => {
        return {
          id: event.payload.doc.id,
          // tslint:disable-next-line: no-string-literal
          cabinet: event.payload.doc.data()['cabinet'],
          // tslint:disable-next-line: no-string-literal
          end: event.payload.doc.data()['end'].toDate(),
          // tslint:disable-next-line: no-string-literal
          medic: event.payload.doc.data()['medic'],
          // tslint:disable-next-line: no-string-literal
          start: event.payload.doc.data()['start'].toDate(),
          // tslint:disable-next-line: no-string-literal
          title: event.payload.doc.data()['title'],
          // tslint:disable-next-line: no-string-literal
          // tslint:disable-next-line: max-line-length
          color: (event.payload.doc.data()['medic'] === 'Doctor 1') ? colors.red : (event.payload.doc.data()['medic'] === 'Doctor 2') ? colors.blue : colors.yellow,
          // tslint:disable-next-line: no-string-literal
          namePacient: event.payload.doc.data()['namePacient'],
          // tslint:disable-next-line: no-string-literal
          phonePacient: event.payload.doc.data()['phonePacient']
        };
      }))
    );
  }

  // Get appointment form firebase collection
  updateAppointment(id, data) {
    return  this.db.collection('Programari').doc(id).update(data);
  }

  // Add appointment to firebase collection 'Programari'
  addAppointment(appointment) {
    return this.db.collection('Programari').add(appointment);
  }

  // Cancel an appointmnent
  cancelAppointment(id) {
    return this.db.collection('Programari').doc(id).delete().then( () => {
      console.log('Successfully deleted');
    }).catch( e => {
      console.log(e);
    });
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
