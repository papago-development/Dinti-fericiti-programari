import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from 'src/app/services/doctor.service';
import { Doctor } from 'src/app/models/doctor';
import { Programare } from 'src/app/models/programare';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  // Properties
  dataSource = new MatTableDataSource<Patient>();

  // paginator is used for paginating the mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // variable for sorting the events for patient
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'phonePacient', 'action'];

  dialogRef;
  addAppointmentForm: FormGroup;
  patient: Patient;
  createPatient: Patient;
  doctors: Doctor[] = [];
  infoPatient;
  appointment: Programare;
  pacientExists: boolean;
  pacientId: string;



  constructor(private patientService: PatientService,
              private doctorService: DoctorService,
              private appointmentService: AppointmentService,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.loadPatients();
    this.loadDoctors();
    this.createForm();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe(data => {
      this.dataSource.data = data as any[];
    });
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  // filter data from patients table
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Create form for adding new appointment
  createForm() {
    this.addAppointmentForm = this.fb.group({
      id: [''],
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      title: ['', Validators.required],
      medic: ['', Validators.required],
      start: ['', Validators.required],
      emailPacient: ['', Validators.email],
      end: ['', Validators.required]
    });
  }

  // Open dialog for adding a new event
  openDialog(addContent, id: any): void {
    this.dialogRef = this.dialog.open(addContent);
    this.patientService.getPatientById(id).subscribe(res => {
      console.log('res', res);
      localStorage.setItem('pacientId', id);
      console.log('pacient id', id);
      this.infoPatient = {
        name: res.name,
        phonePacient: res.phonePacient,
        emailPacient: res.emailPacient
      };

      // Set values from event to dialog
      this.addAppointmentForm.controls.namePacient.setValue(this.infoPatient.name);
      this.addAppointmentForm.controls.phonePacient.setValue(this.infoPatient.phonePacient);
      this.addAppointmentForm.controls.emailPacient.setValue(this.infoPatient.emailPacient);
    });
  }

  // Close the modal dialog
  closeDialog(): void {
    this.dialogRef.close();
    this.addAppointmentForm.reset();
  }

  addAppointment() {
    if (this.addAppointmentForm.valid) {
      this.appointment = Object.assign({}, this.addAppointmentForm.value);

      this.createPatient = {
        name: this.appointment.namePacient,
        phonePacient: this.appointment.phonePacient,
        emailPacient: this.appointment.emailPacient,
        title: this.appointment.title,
        medic: this.appointment.medic,
        files: [{filename: null, url: null}]
      };

      // If patient exists return true, otherwise return false
      this.patientService.patientExists(this.appointment.phonePacient).then(data => {
        this.pacientExists = data;

        // If patient exists update values from patient
        if (this.pacientExists) {
          this.patientService.getPatientByName(this.appointment.namePacient).subscribe(res => {
            if (res.length > 0) {
              localStorage.setItem('pacientId', res[0]);

              // Get the patient Id from localstorage
              this.pacientId = localStorage.getItem('pacientId');

              this.patientService
                .updatePatient(this.pacientId, this.createPatient)
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
          this.patientService.addPacient(this.createPatient);
          console.log('Added');
        }
      });

      // Add event/appointment to 'Programari' collection
      this.appointmentService.addAppointment(this.appointment)
        .then(() => {
          this.dialogRef.close();
        })
        .catch(err => {
          console.log(err);
        });

      console.log('create patient', this.createPatient);
    }
  }

  getNamePacientErrorMessage() {
    return this.addAppointmentForm.controls.namePacient.hasError('required')
      ? 'You must enter a value'
      : '';
  }

  getPhoneErrorMessage() {
    return this.addAppointmentForm.controls.phonePacient.hasError('required')
      ? 'You must enter a value'
      : this.addAppointmentForm.controls.phonePacient.hasError('maxlength')
        ? 'Maximum length is 10 character'
        : '';
  }

  getEmailErrorMessage() {
    return this.addAppointmentForm.controls.emailPacient.hasError('email')
      ? 'Insert a valid email'
      : '';
  }

  getSubjectErrorMessage() {
    return this.addAppointmentForm.controls.title.hasError('required')
      ? 'You must enter a value'
      : '';
  }

  getDoctorErrorMessage() {
    return this.addAppointmentForm.controls.medic.hasError('required')
      ? 'You must enter a value'
      : '';
  }

  getStartErrorMessage() {
    return this.addAppointmentForm.controls.start.hasError('required')
      ? 'You must enter a value'
      : '';
  }

  getEndErrorMessage() {
    return this.addAppointmentForm.controls.end.hasError('required')
      ? 'You must enter a value'
      : '';
  }
}
