import { Component, OnInit } from '@angular/core';
import { DoctorService } from 'src/app/services/doctor.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Doctor } from 'src/app/models/doctor';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent implements OnInit {

  // Properties
  form: FormGroup;
  doctor: Doctor;
  doctors: Doctor[] = [];
  constructor(private doctorService: DoctorService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      specializare: ['', Validators.required],
      cabinet: ['', Validators.required]
    });
  }

  add() {
    if (this.form.valid) {
      this.doctor = Object.assign({}, this.form.value);
      this.doctorService.addDoctor(this.doctor);
    }
  }

  getNameErrorMessage() {
    return this.form.controls.name.hasError('required') ? 'You must enter a value' : '';
  }

  getSpecializationErrorMessage() {
    return this.form.controls.specializare.hasError('required') ? 'You must enter a value' : '';

  }
  getCabinetErrorMessage() {
    return this.form.controls.cabinet.hasError('required') ? 'You must enter a value' : '';

  }
}
