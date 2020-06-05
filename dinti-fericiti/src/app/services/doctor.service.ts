import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  public doctorName: any;

  constructor(private db: AngularFirestore) {}



  //Getter for doctor name
  get getDoctorName() {
    return this.doctorName;
  }

  // Get doctors from firebase collection 'Doctori'
  getDoctors(): Observable<any> {
    return this.db
      .collection('Users', ref => ref.where('role', '==', 'user'))
      .valueChanges()
      .pipe(

        map(doctors =>
          doctors.map(data => {
            return data;
          })
        )
      );
  }

  // Add doctor to firebase collection 'Doctori'
  addDoctor(doctor) {
    return this.db.collection('Doctori').add(doctor);
  }

  // Return information about doctor by id
  getDoctorById(id: string): Observable<any> {
    return this.db.collection('Users', ref => ref.where('id', '==', id)).valueChanges();
  }

  //Return doctor email from name
  getEmailByDoctorName(name: string) {
    return this.db.collection('Users', ref => ref.where('name', '==', name)).snapshotChanges().pipe(
    map( events => events.map(event => {
      return event.payload.doc.data()['username']
    })));
  }
}
