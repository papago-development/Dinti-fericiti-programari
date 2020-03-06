import { PlanManoperaService } from './../../../services/plan-manopera.service';
import { PlanManopera } from './../../../models/planManopera';
import { ManoperaService } from './../../../services/manopera.service';
import { Manopera } from './../../../models/manopera';
import { Doctor } from './../../../models/doctor';
import { Subscription } from 'rxjs';
import { DoctorService } from './../../../services/doctor.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-manopera',
  templateUrl: './add-manopera.component.html',
  styleUrls: ['./add-manopera.component.css']
})
export class AddManoperaComponent implements OnInit, OnDestroy {

  // Properties
  manoperaForm: FormGroup;
  doctors: Doctor[] = [];
  manopera: Manopera;
  doctorSubscription: Subscription;
  manopereSubscription: Subscription;
  patientId: string;
  planManopere: PlanManopera[] = [];

  constructor(private doctorService: DoctorService,
              private manoperaService: ManoperaService,
              private planManoperaService: PlanManoperaService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    console.log('patient cnp', this.patientId);
    this.createForm();
    this.loadDoctors();
    this.loadPlanManopere();
  }

  ngOnDestroy() {
    if (this.doctorSubscription) {
      this.doctorSubscription.unsubscribe();
    }

    if (this.manopereSubscription) {
      this.manopereSubscription.unsubscribe();
    }
  }

  createForm() {
    this.manoperaForm = new FormGroup({
      medic: new FormControl(null, Validators.required),
      manopera: new FormControl(null),
      data: new FormControl(null, Validators.required),
      tehnician: new FormControl(null)
    });
  }

  resetForm() {
    this.manoperaForm.reset();
  }

  loadDoctors() {
    this.doctorSubscription = this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  loadPlanManopere() {
    this.planManoperaService.getPlanManopereByCNP(this.patientId).subscribe(data => {
      this.planManopere = data;
    });
  }


  addManopera() {
    this.manopera = Object.assign({}, this.manoperaForm.value);
    console.log('Manopera form ', this.manopera);
    this.manoperaService.addManoperaToPatient(this.patientId, this.manopera);
    this.resetForm();
  }
}
