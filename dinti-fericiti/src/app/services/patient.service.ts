import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) { }

  // Add pacient to firebase collection 'Pacienti'
  async addPacient(pacient, manopere?) {

    if (manopere === null) {
      this.db.collection('Pacienti').doc(`${pacient.cnp}`).set(pacient);
    } else {
      this.db.collection('Pacienti').doc(`${pacient.cnp}`).set(pacient)
        .then(() => {

          // tslint:disable-next-line: max-line-length

        });
      // tslint:disable-next-line: forin
      for (const key in manopere) {
        this.db.collection('Pacienti').doc(`${pacient.cnp}`).collection('PlanManopera')
        .add({
          manopera: manopere[key].manopera,
          medic: manopere[key].medic,
          isFinished: manopere[key].isFinished
        });
      }
    }
  }

  // Get all patients from firebase collection 'Patienti'
  getAllPatients() {
    return this.db
      .collection('Pacienti')
      .snapshotChanges()
      .pipe(
        map(patients =>
          patients.map(patient => {
            return {
              id: patient.payload.doc.id,
              medic: patient.payload.doc.data()['medic'],
              cnp: patient.payload.doc.data()['cnp'],
              // tslint:disable-next-line: no-string-literal
              title: patient.payload.doc.data()['title'],
              // tslint:disable-next-line: no-string-literal
              name: patient.payload.doc.data()['name'],
              // tslint:disable-next-line: no-string-literal
              phonePacient: patient.payload.doc.data()['phonePacient'],
              start: patient.payload.doc.data()['start']
            };
          })
        )
      );
  }

  // Get patient by id
  getPatientById(id): Observable<any> {
    return this.db
      .collection('Pacienti')
      .doc(id)
      .valueChanges();
  }

  // Get patient by name
  getPatientByName(name) {
    return this.db
      .collection('Pacienti', ref => ref.where('name', '==', name))
      .snapshotChanges()
      .pipe(
        map(patient => {
          return patient.map(p => {
            const id = p.payload.doc.id;
            return id;
          });
        })
      );
  }

  // return phone number by patient name
  getPhoneByPatientName(name) {
    return this.db.collection('Pacienti', ref => ref.where('name', '==', name))
      .snapshotChanges()
      .pipe(
        map(data => data.map(event => {
          return {
            phone: event.payload.doc.data()['phonePacient'],
            consimtamant: event.payload.doc.data()['consimtamant']
          }
        }))
      );
  }

  // check if cnp exists in database
  checkCnp(cnp) {
    // return this.db.collection('Pacienti').doc(cnp).valueChanges();
    return this.db.firestore.doc(`Pacienti/${cnp}`).get()
    .then(docSnapshot => {
      if (docSnapshot.exists) {
        return true;
      } else {
        return false;
      }
    });
  }

  // Update patient information
  updatePatient(id, updatePatient) {
    return this.db
      .collection('Pacienti')
      .doc(id)
      .update(updatePatient);
  }

  updatePlanToPatient(patientId, planManopera) {
    return this.db.collection('Pacienti').doc(patientId).collection('PlanManopera').add(planManopera);
  }

  getPatientEventById(id) {
    return       this.db.collection('Pacienti')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(events => {
          const data = events.payload.data();
          return data;
        })
      );
  }

  // Check if patient already exists in database by phoneNumber
  patientExists(phone) {
    return this.db.firestore
      .collection('Pacienti')
      .where('phonePacient', '==', phone)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log(snap);
          return false;
        } else {
          return true;
        }
      });
  }

  patientAppointments(name) {
    return this.db.firestore
      .collection('Pacienti')
      .where('name', '==', name)
      .get()
      .then(snap => {
        snap.forEach(doc => {
          const data = doc.data() as Patient;
          console.log('Data' + JSON.stringify(data));
        });
      });
  }

  addFileToPatient(patientId, file) {
    this.db
      .collection('Pacienti')
      .doc(patientId)
      .update(Object.assign({ files: file }))
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch(err => {
        console.log(err);
      });
  }

  addFileToPatientName(name, file) {
    this.db
      .collection('Pacienti')
      .doc(name)
      .update(Object.assign({ files: file }))
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteFileFromPatient(urlPhoto) {
    return this.storage.ref(urlPhoto).delete();
  }

  /**
   * Delete patient from firestore by id
   */
  deleteById(id) {
    return this.db.collection('Pacienti').doc(id).delete();
  }
}
