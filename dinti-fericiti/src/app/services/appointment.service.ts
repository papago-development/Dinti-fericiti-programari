import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private db: AngularFirestore) { }

  // Get appointments from firebase collection 'Programari'
  getAppointments() {
    return this.db.collection('Programari').valueChanges().pipe(
      tap(events => console.log(events)),
      map( events => events.map(event => {
        const data: any = event;
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
}
