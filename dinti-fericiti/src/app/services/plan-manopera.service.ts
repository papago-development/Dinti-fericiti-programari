import { PlanManopera } from './../models/planManopera';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanManoperaService {

  constructor(private db: AngularFirestore) { }

  addManopera(planManopera) {
    this.db.collection('PlanManopera').add(planManopera);
  }

  getByCnp(cnp) {
    return this.db.firestore.collection('PlanManopera')
                .where('CNP', '==', cnp)
                .get()
                .then(snap => {
                  snap.forEach(doc => {
                    const data = doc.data() as PlanManopera;
                    console.log('Data' + JSON.stringify(data));
                  });
                });
  }
}
