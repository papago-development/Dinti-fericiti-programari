import { AngularFirestore } from '@angular/fire/firestore';
import { PlanManopera } from './../models/planManopera';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PlanManoperaService {

  private manoperaList: PlanManopera[] = [];

  constructor(private db: AngularFirestore) { }

  add(manopera) {
    this.manoperaList.push(manopera);
  }

  getManopera() {
    return this.manoperaList;
  }

  getItemFromDatabaseByCNP(cnp): Observable<any> {
    return this.db.collection('Pacienti').doc(`${cnp}`).collection('Manopera').valueChanges().pipe(
        // tap(doctors => console.log('Doctors', doctors)),
        map(data =>
          data.map(item => {
            return item;
          })
        )
      );
    // return this.db.collection('Pacienti/{cnp}/Manopera/{manoperaId}').valueChanges().pipe(
    //   // tap(doctors => console.log('Doctors', doctors)),
    //   map(data =>
    //     data.map(item => {
    //       return item;
    //     })
    //   )
    // );
  }
}
