import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { colors } from '../models/colors';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private db: AngularFirestore) {}

  // Get doctors from firebase collection 'Doctori'
  getDoctors(): Observable<any> {
    return this.db
      .collection('Doctori')
      .valueChanges()
      .pipe(
        tap(doctors => console.log(doctors)),
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
}
