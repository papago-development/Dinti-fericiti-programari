import { Manopera } from './../models/manopera';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManoperaService {

  constructor(private db: AngularFirestore) { }

  addManopera(manopera) {
    this.db.collection('Manopera').add(manopera);
  }

  getByCnp(cnp) {
    return this.db.firestore.collection('Manopera')
                .where('CNP', '==', cnp)
                .get()
                .then(snap => {
                  snap.forEach(doc => {
                    const data = doc.data() as Manopera;
                    console.log('Data' + JSON.stringify(data));
                  });
                });
  }
}
