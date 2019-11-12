import { Component, OnInit } from '@angular/core';
import { Programare } from '../models/programare';
import { AppointmentService } from '../services/appointment.service';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Properties
  view = 'day';
  viewDate: Date = new Date();

  events: any[] = [];
  event: Programare;
  updatedEvent: any;
  doctors: Doctor[] = [];
  doctor: any;
  dialogRef;

  clickedDate: Date;
  clickedColumn: number;
  form: FormGroup;
  updateForm: FormGroup;
  pacient: Patient;
  public pacientId: string;
  updatedPacient: any;
  subsUpdate: Subscription;

  constructor(private appointmentService: AppointmentService,
              private doctorService: DoctorService, private dialog: MatDialog,
              private fb: FormBuilder, private pacientService: PatientService) { }

  ngOnInit() {
    this.loadAppointments();
    this.loadDoctors();
    this.createForm();
    this.createUpdateForm();
  }

  // Open dialog for adding a new event
  openDialog(addContent): void {
    this.dialogRef = this.dialog.open(addContent);
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.form.reset();
  }

  // Load all appointments from database
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(data => {
      this.events = data;
      console.log('Events', this.events);
    });
  }

  // Load all doctors from database
  loadDoctors() {
    this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
      console.log('Doctors: ', data);
    });
  }

  // Filter events after doctor
  filterData(event, doctor) {
    // if checkbox is checked then return the list of filtered events
    if (event.target.checked) {
      this.doctor = doctor;

      this.events = this.events.filter(m => m.medic === this.doctor);
      console.log('Filtered events: ', this.events);
      return this.events;
    } else {
      // otherwise return the whole list of events
      this.loadAppointments();
    }
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      title: ['', Validators.required],
      medic: ['', Validators.required],
      start: [this.clickedDate, Validators.required],
      end: ['', Validators.required]
    });
  }

  createUpdateForm() {
    this.updateForm = this.fb.group({
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      title: ['', Validators.required],
      medic: ['', Validators.required]
    });
  }

  // Add appointment to firebase
  addAppointment() {
    if (this.form.valid) {
      this.event = Object.assign({}, this.form.value);
      console.log('Add event', this.event);

      this.pacient = {
        name: this.event.namePacient,
        phonePacient: this.event.phonePacient,
        medic: this.event.medic,
        start: this.event.start,
        title: this.event.title
      };

      this.pacientService.addPacient(this.pacient);
      this.appointmentService.addAppointment(this.event)
        .then(() => {
          this.dialogRef.close();
        });
    }
  }

  // Open dialog for editing
  openEditDialog({ event }: { event: Programare }, editContent) {
    this.dialogRef = this.dialog.open(editContent);
    this.updatedEvent = event;

    // tslint:disable-next-line: max-line-length
    this.updatedPacient = { name: event.namePacient, phonePacient: event.phonePacient, title: event.title, medic: event.medic};
    console.log(this.updatedPacient);

    // Set values from event to dialog
    this.updateForm.controls.namePacient.setValue(event.namePacient);
    this.updateForm.controls.phonePacient.setValue(event.phonePacient);
    this.updateForm.controls.title.setValue(event.title);
    this.updateForm.controls.medic.setValue(event.medic);

    console.log('Edit event', event.id);
    console.log('Edit event', event);
  }

  // Update an existing appointment
  updateAppointment() {
    if (this.updateForm.valid) {
      this.updateAppointment = Object.assign({}, this.updateForm.value);

      this.appointmentService.updateAppointment(this.updatedEvent.id, this.updateAppointment)
        .then(() => {
          this.dialogRef.close();
        });
    }
  }

  // Delete an appointment
  cancelEvent() {
    this.appointmentService.cancelAppointment(this.updatedEvent.id).then(() => {
      this.dialogRef.close();
    });
  }

  getNamePacientErrorMessage() {
    return this.form.controls.namePacient.hasError('required') ? 'You must enter a value' : '';
  }

  getPhoneErrorMessage() {
    return this.form.controls.phonePacient.hasError('required') ? 'You must enter a value' :
      this.form.controls.phonePacient.hasError('maxlength') ? 'Maximum length is 10 character' : '';
  }

  getSubjectErrorMessage() {
    return this.form.controls.title.hasError('required') ? 'You must enter a value' : '';
  }

  getDoctorErrorMessage() {
    return this.form.controls.medic.hasError('required') ? 'You must enter a value' : '';
  }

  getEndErrorMessage() {
    return this.form.controls.end.hasError('required') ? 'You must enter a value' : '';
  }
}
