import { AngularFirestore } from '@angular/fire/firestore';
import { PlanManopera } from './../models/planManopera';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlanManoperaService {

  private planManoperaList: PlanManopera[] = [];

  constructor(private db: AngularFirestore) { }

  add(planManopera) {
    this.planManoperaList.push(planManopera);
  }

  getPlanManopera() {
    return this.planManoperaList;
  }

  getPlanManopereByCNP(cnp): Observable<any> {
    return this.db.collection('Pacienti').doc(`${cnp}`).collection('PlanManopera') .snapshotChanges().pipe(
      map(data => data.map(event => {
        return {
          id: event.payload.doc.id,
          medic: event.payload.doc.data()['medic'],
          manopera: event.payload.doc.data()['manopera'],
          isFinished: event.payload.doc.data()['isFinished']
        };
      })));
  }

  deletePlanManopera(manoperaId, patientId) {
    return this.db.collection('Pacienti').doc(patientId).collection('PlanManopera').doc(manoperaId).delete();
  }

}
