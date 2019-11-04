import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {

  // Properties
  room: Room;
  form: FormGroup;
  rooms: Room[] = [];

  constructor(private roomService: RoomService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe( data => {
      this.rooms = data;
    });
  }

  // Create form
  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // Reset field form form
  resetForm() {
    this.form.reset();
  }

  // Add room to database
  add() {
    if (this.form.valid) {
      this.room = Object.assign({}, this.form.value);
      this.roomService.addRoom(this.room);
    }
    setTimeout(() => {
      this.resetForm();
    }, 1000);
  }

  getNameErrorMessage() {
    return this.form.controls.name.hasError('required') && this.form.controls.name.touched ? 'You must enter a value' : '';
  }
}
