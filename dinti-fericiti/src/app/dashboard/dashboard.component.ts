import { DoctorsNameEnum } from './../models/doctorName';
import { LastAppointmentService } from './../services/last-appointment.service';
import { Manopera } from './../models/manopera';
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Programare } from '../models/programare';
import { AppointmentService } from '../services/appointment.service';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { Subscription, Subject, Observable } from 'rxjs';
import { CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { CustomDateFormatter } from '../customDate/customDateFormatter';
import { CustomEventTitleFormatter } from '../customTitle/customEventTitleFormatter';
import { ILastAppointment } from '../models/ILastAppointment';
import { Files } from '../models/files';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Properties

  // Properties for angular calendar
  view = 'day';
  viewDate: Date = new Date();
  locale = 'ro';

  events: any[] = [];
  event: Programare;
  updatedEvent: any;
  doctors: Doctor[] = [];
  doctor: any;
  lastAppointment: ILastAppointment;
  name: string;

  dialogRef;

  clickedDate: Date;
  form: FormGroup;
  updateForm: FormGroup;
  pacient: Patient;
  pacientId: string;
  updatedPacient: Patient;
  updatedAppointment: Programare;
  pacientExists: boolean;
  checked = true; // variable for doctor checkbox
  checkboxes: any[] = []; // list of checkboxes
  filteredEvents: Array<any> = [];
  obj: Array<any> = [];
  refresh: Subject<any> = new Subject();
  email: any = [];
  colorsArray: any[] = [
    '#ad2121',
    '#FFB6C1',
    '#d16c19',
    '#e3bc08',
    '#8B008B',
    '#006400',
    '#1e90ff',
    '#5A2C2B'
  ];

  // Properties
  files: Array<Files> = [];
  url: Observable<string | null>;
  isUpdated: boolean;
  manopera: Manopera;
  selectedDoctor: any;

  // Subscriptions
  loadAppointmentsSubs: Subscription;
  loadDoctorsSubs: Subscription;
  getAppointmentsSubs: Subscription;
  doctorsSubs: Subscription;

  @Input() phoneNumber: string;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private pacientService: PatientService,
    private dbStorage: AngularFireStorage,
    private lastAppointmentService: LastAppointmentService
  ) { }

  ngOnInit() {
    this.selectedDoctor = this.doctorService.doctorName;

    this.loadAppointments();
    this.loadDoctors();
    this.createForm();
    this.createUpdateForm();

  }

  ngOnDestroy() {
    if (this.loadAppointments) {
      this.loadAppointmentsSubs.unsubscribe();
    }

    if (this.loadDoctorsSubs) {
      this.loadDoctorsSubs.unsubscribe();
    }

    if (this.doctorsSubs) {
      this.doctorsSubs.unsubscribe();
    }
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
    this.loadAppointmentsSubs = this.appointmentService
      .getAppointments()
      .subscribe(data => {
        this.events = data;
        this.filteredEvents = this.events.filter(m => m.medic === this.selectedDoctor);
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
  filterData($event, doctor) {

    this.selectedDoctor = doctor;
    this.doctorService.doctorName = this.selectedDoctor;

    this.filteredEvents = this.events;

    switch (this.selectedDoctor) {
      case DoctorsNameEnum.AnaSandu:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      case DoctorsNameEnum.AndreeaBerendei:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      case DoctorsNameEnum.DianaEne:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      case DoctorsNameEnum.ErnaDupir:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      case DoctorsNameEnum.GeorgetaNicoletaDinu:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      case DoctorsNameEnum.IlonaPetrica:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      case DoctorsNameEnum.LauraPrie:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      case DoctorsNameEnum.RalucaCalu:
        this.filteredEvents = this.filteredEvents.filter(m => m.medic === this.selectedDoctor);
        break;
      default:
        this.loadAppointmentsSubs = this.appointmentService
          .getAppointments()
          .subscribe(data => {
            this.events = data;
            this.filteredEvents = this.events;
            this.refresh.next();
          });
        break;
    }
  }

  // Create form for adding new event/appointment
  createForm() {
    this.form = this.fb.group({
      id: [''],
      namePacient: ['', Validators.required],
      phonePacient: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10)
        ]
      ],
      title: ['', Validators.required],
      medic: ['', Validators.required],
      start: [this.clickedDate, Validators.required],
      emailPacient: ['', Validators.email],
      end: ['', Validators.required],
      consimtamant: ['', Validators.required]
    });
  }

  // Create form for updating an existent event/appointment
  createUpdateForm() {
    this.updateForm = this.fb.group({
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      emailPacient: ['', Validators.email],
      title: ['', Validators.required],
      medic: ['', Validators.required],
      consimtamant: ['', Validators.required]
    });
  }

  // Add appointment to firebase
  addAppointment() {
    if (this.form.valid) {
      this.event = Object.assign({}, this.form.value);

      this.name = this.event.namePacient;
      this.pacient = {
        name: this.event.namePacient,
        phonePacient: this.event.phonePacient,
        emailPacient: this.event.emailPacient,
        start: this.event.start,
        medic: this.event.medic,
        title: this.event.title,
        files: this.files,
        consimtamant: this.event.consimtamant
      };

      this.doctorService
        .getEmailByDoctorName(this.event.medic)
        .subscribe(result => {
          this.email = result.toString();

          this.lastAppointment = {
            pacientName: this.event.namePacient,
            pacientPhone: this.event.phonePacient,
            doctorEmail: this.email,
            doctorName: this.event.medic,
            lastDate: this.event.start
          };

          // Add pacient to 'UltimeleProgramari' collection
          this.lastAppointmentService
            .addLastAppointment(this.lastAppointment)
            .then()
            .catch(err => {
              console.error(err);
            });
        });

      // If patient exists return true, otherwise return false
      this.pacientService.patientExists(this.event.phonePacient).then(data => {
        this.pacientExists = data;

        // If patient exists update values from patient
        if (this.pacientExists) {
          this.pacientService
            .getPatientByName(this.event.namePacient)
            .subscribe(res => {
              if (res.length > 0) {
                localStorage.setItem('pacientId', res[0]);

                // Get the patient Id from localstorage
                this.pacientId = localStorage.getItem('pacientId');

                this.pacientService
                  .updatePatient(this.pacientId, this.pacient)
                  .then()
                  .catch(err => {
                    console.log(err);
                  });
              }
            });
        } else {
          // Otherwise create a new patient in 'Patient' collection
          this.pacientService.addPacient(this.pacient);
        }
      });

      // Add event/appointment to 'Programari' collection
      this.appointmentService
        .addAppointment(this.event)
        .then(() => {
          this.dialogRef.close();
          this.refresh.next();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  onFileSelected(event) {

    // create a reference to the storage bucket location
    const file = event.target.files[0];
    const filePath = '/' + this.name + '/' + file.name;
    const ref = this.dbStorage.ref(filePath);
    const task = this.dbStorage.upload(filePath, file);

    task
      .then(() => {
        ref.getDownloadURL().subscribe(data => {
          this.url = data;
          const fileNew: Files = {
            url: this.url,
            filename: file.name
          };
          this.files.push(fileNew);
          this.isUpdated = true;
        });
      })
      .catch((err) => {
        this.isUpdated = false;
        console.log('Error', err);
      });
  }

  // Open dialog for editing
  openEditDialog({ event }: { event: Programare }, editContent) {
    this.name = event.namePacient;
    this.pacientService.getPatientByName(event.namePacient).subscribe(res => {
      if (res.length > 0) {
        localStorage.setItem('pacientId', res.toString());
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
    this.updateForm.controls.consimtamant.setValue(event.consimtamant);
    // this.updateForm.controls.start.setValue(event.start);
    // this.updateForm.controls.end.setValue(event.end);
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
        files: this.files,
        consimtamant: this.updatedAppointment.consimtamant
      };

      this.pacientId = localStorage.getItem('pacientId');
      if (this.pacientId !== null) {
        this.pacientService
          .updatePatient(this.pacientId, this.updatedPacient)
          .then()
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
          this.isUpdated = false;
          this.refresh.next();
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
      this.refresh.next();
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

  checkPatient() {
    console.log('Name', event.target['value']);
    this.pacientService
      .getPhoneByPatientName(event.target['value'])
      .subscribe(data => {
        const phone = data;
        if (phone !== null) {
          this.phoneNumber = phone[0];
        }
      });
  }
}
