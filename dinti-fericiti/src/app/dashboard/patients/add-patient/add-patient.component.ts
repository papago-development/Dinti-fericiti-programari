import { PlanManoperaService } from './../../../services/plan-manopera.service';
import { Manopera } from './../../../models/manopera';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Input, OnChanges } from '@angular/core';
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
  maxLengthCNP = 13;
  maxLengthPhone = 10;
  isOptional = false;
  manopereForm: FormGroup;
  manopere: FormArray;
  cnpPatient: string;

  // tslint:disable-next-line: no-input-rename
  manoperaList: PlanManopera[] = [];

  constructor(private patientService: PatientService,
              private doctorService: DoctorService,
              private manoperaService: PlanManoperaService,
              private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.loadDoctors();
    console.log('cnp', this.cnpPatient);

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
        // manopere: new FormArray([this.createManopereForm() ])
    });
  }

  createManopereForm() {
    return  this.manopereForm = new FormGroup({
          manopera: new FormControl(null, Validators.required),
          medic: new FormControl(null),
          isFinished: new FormControl(false)
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
  // addPatient() {
  //   this.patient = Object.assign({}, this.addPatientForm.value);
  //   console.log('patient', this.patient);

  //   const patientToSave = {
  //     name: this.patient.name,
  //     cnp: this.patient.cnp,
  //     phonePacient: this.patient.phonePacient,
  //     medic: this.patient.medic,
  //     boli: this.patient.boli,
  //     alergi: this.patient.alergi
  //   };


  //   console.log('manopere', this.addPatientForm.get('manopere').value as FormArray);


  //   this.patientService.addPacient(patientToSave, this.addPatientForm.get('manopere').value as FormArray);
  //   console.log('Add');

  //   setTimeout(() => {
  //     this.router.navigate(['patients']);
  //   }, 100);
  // }

  /* This method will add a patient in firebase
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

  addManopere() {
    this.manopere = this.addPatientForm.get('manopere') as FormArray;
    this.manopere.push(this.createManopereForm());
  }
}
