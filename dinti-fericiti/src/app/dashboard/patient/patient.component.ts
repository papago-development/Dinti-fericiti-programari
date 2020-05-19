import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { Patient } from 'src/app/models/patient';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit, OnDestroy {

  // Properties
  patientId: any;
  patient: Patient;
  patientToUpdate: Patient;

  form: FormGroup;
  sub: Subscription;

  constructor(private patientService: PatientService, private route: ActivatedRoute,
              private fb: FormBuilder) {
               }

  ngOnInit() {

    this.patientId = this.route.snapshot.paramMap.get('id');

    this.createForm();

    this.sub = this.patientService.getPatientById(this.patientId).subscribe(data => {
      this.patient = data;

      // Set values for form field with information about patient
      this.form.controls.name.setValue(this.patient.name);
      this.form.controls.phonePacient.setValue(this.patient.phonePacient);
      this.form.controls.title.setValue(this.patient.title);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Create form for updating patient information
  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phonePacient: ['', Validators.required],
      title: ['', Validators.required]
    });
  }

  // Method for updating the patient information
  updatePatient() {
    this.patientToUpdate = Object.assign({}, this.form.value);
    this.patientService.updatePatient(this.patientId, this.patientToUpdate)
    .then()
    .catch(err => {
      console.log(err);
    });
  }
}
