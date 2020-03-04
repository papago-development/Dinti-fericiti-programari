import { PlanManoperaService } from './../../../services/plan-manopera.service';
import { Manopera } from './../../../models/manopera';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { PlanManopera } from 'src/app/models/planManopera';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddPatientComponent implements OnInit {

  // Properties
  addPatientForm: FormGroup;
  patient: Patient;
  doctors: Doctor;
  subscription: Subscription;
  isLinear = false;
  patientForm: FormGroup;
  maxLengthCNP = 13;
  maxLengthPhone = 10;
  infoPatientForm: FormGroup;
  boliPatientForm: FormGroup;
  isOptional = false;

  // tslint:disable-next-line: no-input-rename
  manoperaList: PlanManopera[] = [];

  constructor(private patientService: PatientService,
              private doctorService: DoctorService,
              private manoperaService: PlanManoperaService,
              private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.loadDoctors();
  }

  /**
   * This method is used to create form
   */
  createForm() {
    this.addPatientForm = new FormGroup({

        name: new FormControl(null, Validators.required),
        cnp: new FormControl(null, Validators.required),
        phonePacient: new FormControl(null, Validators.required),
        medic: new FormControl(null, Validators.required),
        boli: new FormControl(null),
        alergi: new FormControl(null)
    });
  }

  loadDoctors() {
    this.subscription = this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
      console.log('doctors', this.doctors);
    });
  }

  /**
   * Tis method will add a patient in firebase
   */
  addPatient() {
    this.patient = Object.assign({}, this.addPatientForm.value);
    console.log('patient', this.patient);

    this.manoperaList = this.manoperaService.getManopera();
    console.log('manopera', this.manoperaList);

    this.patientService.addPacient(this.patient, this.manoperaList);
    console.log('Add');

    setTimeout(() => {
      this.router.navigate(['patients']);
    }, 100);
  }

}
