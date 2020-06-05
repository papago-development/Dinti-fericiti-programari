import { Component, OnInit } from '@angular/core';
import { Programare } from '../models/programare';
import { AppointmentService } from '../services/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../models/user';
import { DoctorService } from '../services/doctor.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { CalendarDateFormatter } from 'angular-calendar';
import { CustomDateFormatter } from '../customDate/customDateFormatter';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class DoctorComponent implements OnInit {
  // Properties
  view = 'day';
  viewDate: Date = new Date();

  events;
  doctorInfo: Users;
  userName: any;
  dialogRef;

  // Form for adding an appointment
  form: FormGroup;

  // Form for updating an appointment
  updateForm: FormGroup;

  event: Programare;
  appointment: any;
  clickedDate: Date;
  patient: Patient;

  interventiiList;
  locale: string = 'en';

  checkboxes: any[] = [];
  filteredEvents: any[] = [];
  pacientExists: boolean;
  pacientId: string;
  updatedPacient: Patient;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

    // userName variable stores the name of current doctor
    this.userName = this.authService.currentUser.name;
  }

  ngOnInit() {
    this.loadAppointments();
    this.route.params.subscribe(params => {
      this.doctorService.getDoctorById(params.id).subscribe(i => {
        this.doctorInfo = i;
      });
    });
    this.createForm();
    this.createUpdateForm();
  }

  // Get appointments for logged in doctor
  loadAppointments() {
    // Get all the events
    // Current user will have appointments coloured with red and the other doctors will have assigned the grey colour
    this.appointmentService
      .getAppointmentByDoctor(this.userName)
      .subscribe(data => {
        this.events = data;
      });
  }

  // The method is used to make events unclickable is doesn't belong to the current user
  eventClicked({ event }: { event: Programare }): void {
    console.log(event);
  }

  // Open dialog
  openDialog(addContent) {
    this.dialogRef = this.dialog.open(addContent);

    // Clear local storage
    localStorage.removeItem('pacientId');
  }

  // Open edit dialog
  openEditDialog({ event }: { event: Programare}, editContent) {
    if (event.medic === this.authService.currentUser.name) {
      this.patientService.getPatientByName(event.namePacient).subscribe(res => {
        if (res.length > 0) {
          localStorage.setItem('pacientId', res.toString());
        } else {
          localStorage.removeItem('pacientId');
        }
      });

      this.dialogRef = this.dialog.open(editContent);
      this.appointment = event;

      // Set values from event to dialog
      this.updateForm.controls.namePacient.setValue(event.namePacient);
      this.updateForm.controls.phonePacient.setValue(event.phonePacient);
      this.updateForm.controls.title.setValue(event.title);
      this.updateForm.controls.medic.setValue(event.medic);
      this.updateForm.controls.emailPacient.setValue(event.emailPacient);
    }
  }

  // This method is used to close the modal dialog when user clicks on 'X' button
  onNoClick() {
    this.dialog.closeAll();
  }

  // Create form for adding appointment
  createForm() {
    this.form = this.fb.group({
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      emailPacient: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      medic: [this.userName, Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  // Create form for updating an appointment
  createUpdateForm() {
    this.updateForm = this.fb.group({
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      emailPacient: ['', [Validators.required, Validators.email]],
      title: ['', Validators.required],
      medic: [this.userName, Validators.required]
    });
  }

  // Add appointment
  addAppointment() {
    if (this.form.valid) {
      this.event = Object.assign({}, this.form.value);

      this.patient = {
        name: this.event.namePacient,
        phonePacient: this.event.phonePacient,
        emailPacient: this.event.emailPacient,
        medic: this.event.medic,
        start: this.event.start,
        title: this.event.title,
        files: [{
          filename: '',
          url: null
        }]
      };

      // If patient exists return true, otherwise return false
      this.patientService.patientExists(this.event.phonePacient).then(data => {
        this.pacientExists = data;

        // If patient exists update values from patient
        if (this.pacientExists) {
          this.patientService.getPatientByName(this.event.namePacient).subscribe(res => {
            if (res.length > 0) {
              localStorage.setItem('pacientId', res[0]);

              // Get the patient Id from localstorage
              this.pacientId = localStorage.getItem('pacientId');

              this.patientService
                .updatePatient(this.pacientId, this.patient)
                .then()
                .catch(err => {
                  console.log(err);
                });
            }
          });
        } else {
          // Otherwise create a new patient in 'Patient' collection
          this.patientService.addPacient(this.patient);
        }
      });

      this.appointmentService.addAppointment(this.event).then(() => {
        // After adding the appointment into collection
        // we reset the form and close the modal
        this.dialog.closeAll();
        this.form.reset();
      }).catch(err => {
        console.log(err);
      });
    }
  }

  // Update appointment
  updateAppointment() {
    if (this.updateForm.valid) {
      this.event = Object.assign({}, this.updateForm.value);

      this.updatedPacient = {
        name: this.event.namePacient,
        phonePacient: this.event.phonePacient,
        emailPacient: this.event.emailPacient,
        title: this.event.title,
        medic: this.event.medic,
        files: [{
          filename: '',
          url: null
        }]
      };

      this.pacientId = localStorage.getItem('pacientId');
      if (this.pacientId !== null) {
        this.patientService
          .updatePatient(this.pacientId, this.updatedPacient)
          .then()
          .catch(err => {
            console.log(err);
          });
      } else {
        this.patientService.addPacient(this.updatedPacient);
      }

      this.appointmentService.updateAppointment(this.appointment.id, this.event).then( () => {
        this.dialog.closeAll();
        this.updateForm.reset();
      }).catch( err => {
        console.log(err);
      });
    }
  }

  // Cancel an event
  cancelEvent() {
    this.appointmentService.cancelAppointment(this.appointment.id).then( () => {
      this.dialog.closeAll();
      this.updateForm.reset();
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

  getEmailErrorMessage() {
    return this.form.controls.emailPacient.hasError('required') ? 'You must enter a value' :
          this.form.controls.emailPacient.hasError('email') ? 'Insert a valid email' : '';
  }

}
