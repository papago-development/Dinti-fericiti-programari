import { Component, OnInit } from '@angular/core';
import { Programare } from '../models/programare';
import { Room } from '../models/room';
import { RoomService } from '../services/room.service';
import { AppointmentService } from '../services/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../models/user';
import { DoctorService } from '../services/doctor.service';
import { AuthService } from '../services/auth.service';

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

  constructor(private roomService: RoomService, private appointmentService: AppointmentService,
              private route: ActivatedRoute, private doctorService: DoctorService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.loadRooms();
    this.loadAppointments();
    this.route.params.subscribe(params => {
      this.doctorService.getDoctorById(params.id).subscribe(i => {
        this.doctorInfo = i;
        console.log('Doctor id', this.doctorInfo[0].name);
      });
    });
  }

  // Get appointments for logged in doctor
  loadAppointments() {
    // userName variable stores the name of current doctor
    this.userName = this.authService.currentUser.name;

    // Get all the events
    // Current user will have appointments coloured with red and the other doctors will have assigned the grey colour
    this.appointmentService.getAppointmentByDoctor(this.userName).subscribe(data => {
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
}
