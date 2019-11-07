import { Component, OnInit } from '@angular/core';
import { Programare } from '../models/programare';
import { Room } from '../models/room';
import { RoomService } from '../services/room.service';
import { AppointmentService } from '../services/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../models/user';
import { DoctorService } from '../services/doctor.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  // Properties
  view = 'day';
  viewDate: Date = new Date();
  events: any[] = [];
  rooms: Room[] = [];
  room: Room;
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

  constructor(
    private roomService: RoomService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {

    // userName variable stores the name of current doctor
    this.userName = this.authService.currentUser.name;
  }

  ngOnInit() {
    this.loadRooms();
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
        console.log('Events', data);
        this.events = data;
      });
  }

  loadRooms() {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  // Events filtered by rooms
  filterData(event, room) {
    if (event.target.checked) {
      this.room = room;
      this.events = this.events.filter(r => r.cabinet === room);
      return this.events;
    } else {
      this.loadAppointments();
    }
  }

  // The method is used to make events unclickable is doesn't belong to the current user
  eventClicked({ event }: { event: Programare }, addContent): void {
    console.log(event);
    // if (event.medic === this.authService.currentUser.name) {
    //   this.dialogRef = this.dialog.open(addContent);
    // }
  }

  // Open dialog
  openDialog(addContent) {
    this.dialogRef = this.dialog.open(addContent);
  }

  // Open edit dialog
  openEditDialog({ event }: { event: Programare}, editContent) {
    if (event.medic === this.authService.currentUser.name) {
      this.dialogRef = this.dialog.open(editContent);
      this.appointment = event;

      // Set values from event to dialog
      this.updateForm.controls.namePacient.setValue(event.namePacient);
      this.updateForm.controls.phonePacient.setValue(event.phonePacient);
      this.updateForm.controls.title.setValue(event.title);
      this.updateForm.controls.medic.setValue(event.medic);
      this.updateForm.controls.cabinet.setValue(event.cabinet);
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
      title: ['', Validators.required],
      medic: [this.userName, Validators.required],
      cabinet: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  // Create form for updating an appointment
  createUpdateForm() {
    this.updateForm = this.fb.group({
      namePacient: ['', Validators.required],
      phonePacient: ['', [Validators.required, Validators.maxLength(10)]],
      title: ['', Validators.required],
      medic: [this.userName, Validators.required],
      cabinet: ['', Validators.required]
    });
  }

  // Add appointment
  addAppointment() {
    if (this.form.valid) {
      this.event = Object.assign({}, this.form.value);
      this.appointmentService.addAppointment(this.event).then(res => {
        // After adding the appointment into collection
        // we reset the form and close the modal
        this.dialog.closeAll();
        this.form.reset();
      });
    }
  }

  // Update appointment
  updateAppointment() {
    if (this.updateForm.valid) {
      this.event = Object.assign({}, this.updateForm.value);
      this.appointmentService.updateAppointment(this.appointment.id, this.event).then( res => {
        this.dialog.closeAll();
        this.updateForm.reset();
      });
    }
  }

  // Cancel an event
  cancelEvent() {
    this.appointmentService.cancelAppointment(this.appointment.id).then( res => {
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

  getCabinetErrorMessage() {
    return this.form.controls.cabinet.hasError('required') ? 'You must enter a value' : '';
  }

  getEndErrorMessage() {
    return this.form.controls.end.hasError('required') ? 'You must enter a value' : '';
  }

}
