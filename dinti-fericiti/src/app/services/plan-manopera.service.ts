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
    return this.db.collection('Pacienti').doc(`${cnp}`).collection('PlanManopera').valueChanges();

  }

}
