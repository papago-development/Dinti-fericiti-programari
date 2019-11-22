import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
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
          color: (event.payload.doc.data()['medic'] === 'Laura Prie') ? colors.red : (event.payload.doc.data()['medic'] === 'Erna Dupir') ? colors.blue : colors.yellow,
          // tslint:disable-next-line: no-string-literal
          namePacient: event.payload.doc.data()['namePacient'],
          // tslint:disable-next-line: no-string-literal
          phonePacient: event.payload.doc.data()['phonePacient'],
          emailPacient: event.payload.doc.data()['emailPacient']
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

  // View appointments by doctor name
  // Get appointment with specific color for logged user and gray for other users
  getAppointmentByDoctor(name) {
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
          color: (event.payload.doc.data()['medic'] === name) ? colors.red : colors.gray,
          // tslint:disable-next-line: no-string-literal
          namePacient: event.payload.doc.data()['namePacient'],
          // tslint:disable-next-line: no-string-literal
          phonePacient: event.payload.doc.data()['phonePacient'],
          emailPacient: event.payload.doc.data()['emailPacient']
        };
      }))
    );
  }

  getAppointmentByPatientName(name) {
    return this.db.collection('Programari', ref => ref.where('namePacient', '==', name))
                .snapshotChanges()
                .pipe(
                  map(events => events.map(event => {
                    return {
                      title: event.payload.doc.data()['title'],
                      start: event.payload.doc.data()['start'].toDate()
                    };
                  }))
                );
  }
}
