import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
        map(doctors =>
          doctors.map(data => {
            return data;
          })
        )
      );
  }
}
