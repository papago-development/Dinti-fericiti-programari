import { Component, OnInit } from '@angular/core';
import { Programare } from '../models/programare';
import { AppointmentService } from '../services/appointment.service';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Properties
  view = 'day';
  viewDate: Date = new Date();
  events: Programare[] = [];
  event: Programare;
  doctors: Doctor[] = [];
  doctor: any;
  dialogRef;

  clickedDate: Date;
  clickedColumn: number;
  form: FormGroup;

  constructor(private appointmentService: AppointmentService,
              private doctorService: DoctorService, private dialog: MatDialog,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.loadAppointments();
    this.loadDoctors();
    this.createForm();
  }

  // Open dialog for adding a new event
  openDialog(addContent): void {
    this.dialogRef = this.dialog.open(addContent);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Load all appointments from database
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe( data => {
      this.events = data;
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
        namePacient: ['', Validators.required],
        phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
        title: ['', Validators.required],
        medic: ['', Validators.required],
        cabinet: ['', Validators.required],
        start: [this.clickedDate, Validators.required],
        end: ['', Validators.required]
    });
  }

  addAppointment() {
    if (this.form.valid) {
      this.event = Object.assign({}, this.form.value);
      console.log('Add event', this.event);
      this.appointmentService.addAppointment(this.event);
    }
  }
}
