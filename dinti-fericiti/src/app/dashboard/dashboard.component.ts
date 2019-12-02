import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { Programare } from '../models/programare';
import { AppointmentService } from '../services/appointment.service';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { CustomDateFormatter } from '../customDate/customDateFormatter';
import { CustomEventTitleFormatter } from '../customTitle/customEventTitleFormatter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }, {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Properties
  view = 'day';
  viewDate: Date = new Date();

  events: any = [];
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
  updatedPacient: Patient;
  updatedAppointment: Programare;
  pacientExists: boolean;
  checked = true;
  checkboxes: any[] = [];
  filteredEvents: Array<any> = [];
  locale = 'en';
  obj: Array<any> = [];
  refresh: Subject<any> = new Subject();

  // Subscriptions
  loadAppointmentsSubs: Subscription;
  loadDoctorsSubs: Subscription;
  getAppointmentsSubs: Subscription;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private pacientService: PatientService
  ) { }

  ngOnInit() {
    this.loadAppointments();
    this.loadDoctors();
    this.createForm();
    this.createUpdateForm();
  }

  ngOnDestroy() {
    this.loadAppointmentsSubs.unsubscribe();
    this.loadDoctorsSubs.unsubscribe();
  }

  // Open dialog for adding a new event
  openDialog(addContent): void {
    this.dialogRef = this.dialog.open(addContent);

    // Clear local storage
    localStorage.removeItem('pacientId');
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.form.reset();
  }

  // Load all appointments from database
  loadAppointments() {
    this.loadAppointmentsSubs = this.appointmentService.getAppointments().subscribe(data => {
      this.events = data;
    });
  }

  // Load all doctors from database
  loadDoctors() {
    this.loadDoctorsSubs = this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;

      // tslint:disable-next-line: forin
      for (const i in data) {
        this.checkboxes.push({ name: data[i].name, checked: true });
      }
    });
  }

  // Filter events after doctor
  filterData(event, doctor) {
    if (event.target.checked === false) {
      this.obj = this.events;
      this.checkboxes.forEach(val => {
        if (val.name === doctor) {
          this.checked = !this.checked;
          console.log('checked', this.checked);
        }
        this.doctor = doctor;
      });

      this.obj.forEach(item => {
        if (item.medic === this.doctor) {
          const index = this.obj.indexOf(item);
          console.log('index', index);
          this.obj.splice(index, 1);
        }
      });
      console.log('obj if', this.obj);

      this.events = this.events.filter(m => m.medic !== this.doctor);
      console.log('events', this.events);
    } else {
      this.checkboxes.forEach(val => {
        if (val.name === doctor) {
          val.checked = true;
          this.checked = val.checked;
          console.log('checked', this.checked);

        }
        this.doctor = doctor;
      });
      this.getAppointmentsSubs = this.appointmentService.getAppointments().subscribe(data => {
        this.filteredEvents = data.filter(m => m.medic === this.doctor);
        this.filteredEvents.forEach(item => {
          this.obj.push(item);
          console.log('obj else', this.obj);
        });
        this.events = this.obj;
        this.refresh.next();
        console.log('events', this.events);
      });
    }
  }

  // Create form for adding new event/appointment
  createForm() {
    this.form = this.fb.group({
      id: [''],
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      title: ['', Validators.required],
      medic: ['', Validators.required],
      start: [this.clickedDate, Validators.required],
      emailPacient: ['', Validators.email],
      end: ['', Validators.required]
    });
  }

  // Create form for updating an existent event/appointment
  createUpdateForm() {
    this.updateForm = this.fb.group({
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      emailPacient: ['', Validators.email],
      title: ['', Validators.required],
      medic: ['', Validators.required]
    });
  }

  // Add appointment to firebase
  addAppointment() {
    if (this.form.valid) {
      this.event = Object.assign({}, this.form.value);

      this.pacient = {
        name: this.event.namePacient,
        phonePacient: this.event.phonePacient,
        emailPacient: this.event.emailPacient,
        start: this.event.start,
        medic: this.event.medic,
        title: this.event.title,
        files: [{
          filename: null,
          url: null
        }]
      };

      // If patient exists return true, otherwise return false
      this.pacientService.patientExists(this.event.phonePacient).then(data => {
        this.pacientExists = data;

        // If patient exists update values from patient
        if (this.pacientExists) {
          this.pacientService.getPatientByName(this.event.namePacient).subscribe(res => {
            if (res.length > 0) {
              localStorage.setItem('pacientId', res[0]);

              // Get the patient Id from localstorage
              this.pacientId = localStorage.getItem('pacientId');

              this.pacientService
                .updatePatient(this.pacientId, this.pacient)
                .then(() => {
                  console.log('Successfully updated');
                })
                .catch(err => {
                  console.log(err);
                });
            }
          });
        } else {
          // Otherwise create a new patient in 'Patient' collection
          this.pacientService.addPacient(this.pacient);
          console.log('Added');
        }
      });

      // Add event/appointment to 'Programari' collection
      this.appointmentService.addAppointment(this.event)
        .then(() => {
          this.dialogRef.close();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  // Open dialog for editing
  openEditDialog({ event }: { event: Programare }, editContent) {
    this.pacientService.getPatientByName(event.namePacient).subscribe(res => {
      if (res.length > 0) {
        localStorage.setItem('pacientId', res.toString());
        console.log('pacient id', res.toString());
      } else {
        localStorage.removeItem('pacientId');
      }
    });

    this.dialogRef = this.dialog.open(editContent);
    this.updatedEvent = event;

    // Set values from event to dialog
    this.updateForm.controls.namePacient.setValue(event.namePacient);
    this.updateForm.controls.phonePacient.setValue(event.phonePacient);
    this.updateForm.controls.title.setValue(event.title);
    this.updateForm.controls.medic.setValue(event.medic);
    this.updateForm.controls.emailPacient.setValue(event.emailPacient);
    // this.updateForm.controls.start.setValue(event.start);
    // this.updateForm.controls.end.setValue(event.end);

    console.log('Edit event', event.id);
    console.log('Edit event', event);
  }

  // Update an existing appointment
  updateAppointment() {
    if (this.updateForm.valid) {
      this.updatedAppointment = Object.assign({}, this.updateForm.value);

      // tslint:disable-next-line: max-line-length
      this.updatedPacient = {
        name: this.updatedAppointment.namePacient,
        phonePacient: this.updatedAppointment.phonePacient,
        emailPacient: this.updatedAppointment.emailPacient,
        title: this.updatedAppointment.title,
        medic: this.updatedAppointment.medic,
        files: [{
          filename: '',
          url: null
        }]
      };

      this.pacientId = localStorage.getItem('pacientId');
      if (this.pacientId !== null) {
        this.pacientService
          .updatePatient(this.pacientId, this.updatedPacient)
          .then(() => {
            console.log('successfully update');
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.pacientService.addPacient(this.updatedPacient);
      }

      this.appointmentService
        .updateAppointment(this.updatedEvent.id, this.updatedAppointment)
        .then(() => {
          this.dialogRef.close();
        })
        .catch(err => {
          console.log(err);
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
    return this.form.controls.namePacient.hasError('required')
      ? 'You must enter a value'
      : '';
  }

  getPhoneErrorMessage() {
    return this.form.controls.phonePacient.hasError('required')
      ? 'You must enter a value'
      : this.form.controls.phonePacient.hasError('maxlength')
        ? 'Maximum length is 10 character'
        : '';
  }

  getEmailErrorMessage() {
    return this.form.controls.emailPacient.hasError('email')
      ? 'Insert a valid email'
      : '';
  }

  getSubjectErrorMessage() {
    return this.form.controls.title.hasError('required')
      ? 'You must enter a value'
      : '';
  }

  getDoctorErrorMessage() {
    return this.form.controls.medic.hasError('required')
      ? 'You must enter a value'
      : '';
  }

  getEndErrorMessage() {
    return this.form.controls.end.hasError('required')
      ? 'You must enter a value'
      : '';
  }
}
