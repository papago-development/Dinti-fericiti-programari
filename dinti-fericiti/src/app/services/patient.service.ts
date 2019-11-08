import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private db: AngularFirestore) { }

  // Add pacient to firebase collection 'Pacienti'
  addPacient(pacient) {
     this.db.collection('Pacienti').add(pacient);
  }

  // Get all patients from firebase collection 'Patienti'
  getAllPatients() {
    return this.db.collection('Pacienti').snapshotChanges().pipe(
      map( patients => patients.map(patient => {
        return {
          id: patient.payload.doc.id,
          medic: patient.payload.doc.data()['medic'],
          // tslint:disable-next-line: no-string-literal
          title: patient.payload.doc.data()['title'],
          // tslint:disable-next-line: no-string-literal
          name: patient.payload.doc.data()['name'],
          // tslint:disable-next-line: no-string-literal
          phonePacient: patient.payload.doc.data()['phonePacient']
        };
      }))
    );
  }


  // Get patient by id
  getPatientById(id): Observable<any> {
    return  this.db.collection('Pacienti').doc(id).valueChanges();
  }

  // Update patient information
  updatePatient(id, updatePatient) {
    return this.db.collection('Pacienti').doc(id).update(updatePatient);
  }
}
