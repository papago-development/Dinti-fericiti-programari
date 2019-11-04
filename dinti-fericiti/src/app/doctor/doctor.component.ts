import { Component, OnInit } from '@angular/core';
import { Programare } from '../models/programare';
import { Room } from '../models/room';
import { RoomService } from '../services/room.service';
import { AppointmentService } from '../services/appointment.service';

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

  constructor(private roomService: RoomService, private appointmentService: AppointmentService) { }

  ngOnInit() {
    this.loadRooms();
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointments(). subscribe(data => {
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
