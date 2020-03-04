import { PlanManopera } from './../../../models/planManopera';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Doctor } from './../../../models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { PlanManoperaService } from './../../../services/plan-manopera.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-plan-manopera',
  templateUrl: './add-plan-manopera.component.html',
  styleUrls: ['./add-plan-manopera.component.css']
})
export class AddPlanManoperaComponent implements OnInit, OnChanges {

  // Properties
  doctors: Doctor[] = [];
  doctorSubscription: Subscription;
  planManoperaForm: FormGroup;
  planManopera: PlanManopera;
  manoperaList: any[] = [];

  constructor(private planManoperaService: PlanManoperaService,
              private doctorService: DoctorService) { }

  ngOnInit() {
    this.createForm();
    this.loadDoctors();
    this.getManopera();
  }

  ngOnChanges() {
    this.getManopera();
  }

  createForm() {
    this.planManoperaForm = new FormGroup({
      manopera: new FormControl(null, Validators.required),
      medic: new FormControl(null, Validators.required)
    });
  }

  loadDoctors() {
    this.doctorSubscription = this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  addPlanManopera() {
    // this.planManopera = Object.assign({}, this.planManoperaForm.value);
    // console.log('plan manopera', this.planManopera);
    // this.planManoperaService.addManopera(this.planManopera);
    // window.alert('Manopera a fost adaugata cu success');
  }

  add() {
    this.planManopera = Object.assign({}, this.planManoperaForm.value);
    this.planManoperaService.add(this.planManopera);
    this.planManoperaForm.reset();
  }

  getManopera() {
    this.manoperaList = this.planManoperaService.getManopera();
  }
}
