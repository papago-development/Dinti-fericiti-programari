import { Component, OnInit } from '@angular/core';
import { Programare } from '../models/programare';
import { Room } from '../models/room';
import { RoomService } from '../services/room.service';
import { AppointmentService } from '../services/appointment.service';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../models/user';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  // Properties
  view = 'day';
  viewDate: Date = new Date();
  events: Programare[] = [];
  rooms: Room[] = [];
  room: Room;
  doctorInfo: Users;

  constructor(private roomService: RoomService, private appointmentService: AppointmentService,
              private route: ActivatedRoute, private doctorService: DoctorService) { }

  ngOnInit() {
    this.loadRooms();
    this.loadAppointments();
    this.route.params.subscribe(params => {
      this.doctorService.getDoctorById(params.id).subscribe( i => {
        this.doctorInfo = i;
      });
    });
  }

  // Get appointments for logged in doctor
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(data => {
      this.events = data.filter(a => a.medic === this.doctorInfo[0].name);
      console.log('Events', this.events);
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
