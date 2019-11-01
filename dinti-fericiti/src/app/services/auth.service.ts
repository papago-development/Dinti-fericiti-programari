import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Users } from '../models/user';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: any;
  public userStatus: string;
  public userStatusChages: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);

  constructor(private db: AngularFirestore) { }

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChages.next(userStatus);
  }

  login(username: string, password: string) {
    return this.db.collection('Users', ref => ref.where('username', '==', username)).snapshotChanges().pipe(
      map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Users;
          this.setUserStatus(data);
          return data;
        });
      })
    );
  }



}
