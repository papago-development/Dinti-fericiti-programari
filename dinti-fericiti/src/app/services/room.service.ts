import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private db: AngularFirestore) { }

  // Add new room in firebase collection 'Cabinete'
  addRoom(room) {
    return this.db.collection('Cabinete').add(room);
  }

  getRooms(): Observable<any> {
    return this.db
      .collection('Cabinete')
      .valueChanges()
      .pipe(
        map(rooms =>
          rooms.map(data => {
            return data;
          })
        )
      );
  }

  exists(value) {
    return (this.db.collection('Cabinete').ref.where('name', '==', value)) ? true : false;
  }
}
