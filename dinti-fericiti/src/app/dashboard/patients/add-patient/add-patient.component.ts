import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { PlanManopera } from 'src/app/models/planManopera';
import { Files } from 'src/app/models/files';
import { AngularFireStorage } from '@angular/fire/storage/storage';

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



  url: Observable<string | null>;
  files: Array<Files> = [];
  uploadProgress: Observable<number>;
  percent: number;

  // tslint:disable-next-line: no-input-rename
  planManoperaList: PlanManopera[] = [];

  @Input() cnpPatient: string = null;
  cnpExists: boolean;

  constructor(private patientService: PatientService,
    private doctorService: DoctorService,
    private dbStorage: AngularFireStorage,
    private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.loadDoctors();
    this.percent = 0;
  }

  /**
   * This method is used to create form
   */
  createForm() {
    this.addPatientForm = new FormGroup({

      name: new FormControl(null, Validators.required),
      // tslint:disable-next-line: max-line-length
      cnp: new FormControl(null, [Validators.pattern('\^[0-9]*$'), Validators.minLength(13), Validators.maxLength(13), this.checkCnpPatient.bind(this)]),
      phonePacient: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      medic: new FormControl(null, Validators.required),
      boli: new FormControl(null),
      alergi: new FormControl(null),
      consimtamant: new FormControl(null),
      manopere: new FormArray([this.createManopereForm()])
    });
  }

  createManopereForm() {
    return this.manopereForm = new FormGroup({
      manopera: new FormControl(null, Validators.required),
      medic: new FormControl(null),
      isFinished: new FormControl(false)
    });
  }

  loadDoctors() {
    this.subscription = this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  /**
   * This method will add a patient in firebase
   */
  addPatient() {
    this.patient = Object.assign({}, this.addPatientForm.value);
    let patientToSave;

    console.log('patient', this.patient);

    if (this.patient.cnp === undefined) {
      const cnpRandom = Math.floor(1000000000000 + Math.random() * 9000000000);
      patientToSave = {
        name: this.patient.name,
        cnp: cnpRandom,
        phonePacient: this.patient.phonePacient,
        consimtamant: this.patient.consimtamant,
        medic: this.patient.medic,
        boli: this.patient.boli,
        alergi: this.patient.alergi,
        files: this.files,
        start: new Date()
      };
    } else {
      patientToSave = {
        name: this.patient.name,
        cnp: this.patient.cnp,
        phonePacient: this.patient.phonePacient,
        consimtamant: this.patient.consimtamant,
        medic: this.patient.medic,
        boli: this.patient.boli,
        alergi: this.patient.alergi,
        files: this.files,
        start: new Date()
      };
    }

    this.patientService.addPacient(patientToSave, this.addPatientForm.get('manopere').value as FormArray);

    setTimeout(() => {
      this.router.navigate(['patients']);
    }, 100);
  }

  addManopere() {
    this.manopere = this.addPatientForm.get('manopere') as FormArray;
    this.manopere.push(this.createManopereForm());
  }

  cnp() {
    return this.addPatientForm.get('cnp');
  }

  public hasError(controlName: string, errorName: string) {
    return this.addPatientForm.controls[controlName].hasError(errorName);
  }

  onFileSelected(event) {
    // create a reference to the storage bucket location
    const file = event.target.files[0];
    const filePath = '/' + file.name;
    const ref = this.dbStorage.ref(filePath);
    const task = this.dbStorage.upload(filePath, file);


    this.uploadProgress = task.percentageChanges();
    this.uploadProgress.subscribe(data => {
      this.percent = data;
    });
    task.then(() => {
      ref.getDownloadURL().subscribe(data => {
        this.url = data;



        this.files.push({
          url: this.url,
          filename: file.name
        });

      });
    }).catch(err => console.log('Error', err));
  }

  // checkCnpPatient() {
  //   this.patientService.checkCnp(event.target['value']).then(data => this.cnpExists = data);
  // }

  checkCnpPatient(control: FormControl): {[s: string]: boolean} {
    this.patientService.checkCnp(control.value).then(data => this.cnpExists = data);
    if (this.cnpExists !== true) {
      return { 'alreadyExist' : true };
    }
    return null;
  }
}
