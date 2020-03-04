import { PlanManopera } from 'src/app/models/planManopera';
import { Manopera } from './../../../models/manopera';
import { Doctor } from './../../../models/doctor';
import { Subscription } from 'rxjs';
import { DoctorService } from './../../../services/doctor.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanManoperaService } from 'src/app/services/plan-manopera.service';

@Component({
  selector: 'app-add-manopera',
  templateUrl: './add-manopera.component.html',
  styleUrls: ['./add-manopera.component.css']
})
export class AddManoperaComponent implements OnInit, OnDestroy {

  // Properties
  manoperaForm: FormGroup;
  doctors: Doctor[] = [];
  planManopere: PlanManopera[] = [];
  doctorSubscription: Subscription;
  planManopereSubscription: Subscription;
  patientId: string;

  constructor(private doctorService: DoctorService,
              private planManopereService: PlanManoperaService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    console.log('patient cnp', this.patientId);
    this.createForm();
    this.loadDoctors();
    this.loadManopere();
  }

  ngOnDestroy() {
    if (this.doctorSubscription) {
      this.doctorSubscription.unsubscribe();
    }

    if (this.planManopereSubscription) {
      this.planManopereSubscription.unsubscribe();
    }
  }

  createForm() {
    this.manoperaForm = new FormGroup({
      medic: new FormControl(null, Validators.required),
      manopera: new FormControl(null, Validators.required),
      data: new FormControl(null, Validators.required),
      tehnician: new FormControl(null)
    });
  }

  loadDoctors() {
    this.doctorSubscription = this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  loadManopere() {
    this.planManopereSubscription = this.planManopereService.getItemFromDatabaseByCNP(this.patientId)
                                                            .subscribe(data => {
                                                              this.planManopere = data;
                                                              console.log('plan manopera', this.planManopere);
    });
  }

  save() {
    this.manoperaForm = Object.assign({}, this.manoperaForm.value);
    console.log('Manopera form ', this.manoperaForm);
  }
}
