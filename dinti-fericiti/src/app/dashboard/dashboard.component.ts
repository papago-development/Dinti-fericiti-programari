import { Component, OnInit, OnDestroy } from '@angular/core';
import { Programare } from '../models/programare';
import { AppointmentService } from '../services/appointment.service';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { Subscription } from 'rxjs';
import { RoomService } from '../services/room.service';

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
  rooms: any[] = [];
  dialogRef;

  clickedDate: Date;
  clickedColumn: number;
  form: FormGroup;
  updateForm: FormGroup;
  pacient: Patient;
  public pacientId: string;
  updatedPacient: Patient;
  updatedAppointment: Programare;
  subsUpdate: Subscription;
  pacientExists: boolean;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private pacientService: PatientService,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadDoctors();
    this.loadRooms();
    this.createForm();
    this.createUpdateForm();
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
    this.appointmentService.getAppointments().subscribe(data => {
      this.events = data;
      console.log('Events', this.events);
    });
  }

  // Load all rooms from database
  loadRooms() {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  // Load all doctors from database
  loadDoctors() {
    this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
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

  // Create form for adding new event/appointment
  createForm() {
    this.form = this.fb.group({
      id: [''],
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      title: ['', Validators.required],
      medic: ['', Validators.required],
      start: [this.clickedDate, Validators.required],
      cabinet: [''],
      emailPacient: ['', Validators.email],
      end: ['', Validators.required],

    });
  }

  // Create form for updating an existent event/appointment
  createUpdateForm() {
    this.updateForm = this.fb.group({
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      emailPacient: ['', Validators.email],
      title: ['', Validators.required],
      cabinet: [''],
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
          filename: '',
          url: ''
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
    this.updateForm.controls.cabinet.setValue(event.cabinet);
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
          url: ''
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
