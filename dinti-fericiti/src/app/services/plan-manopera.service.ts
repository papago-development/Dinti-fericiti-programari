import { PlanManopera } from './../models/planManopera';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanManoperaService {

  manoperaList: PlanManopera[] = [];

  constructor() { }

  add(manopera) {
    this.manoperaList.push(manopera);
  }

  getManopera() {
    return this.manoperaList;
  }
}
