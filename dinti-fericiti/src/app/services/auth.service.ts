import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
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

  constructor(private db: AngularFirestore, private dbAuth: AngularFireAuth,
              private router: Router, private ngZone: NgZone) { }

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChages.next(userStatus);
  }

  // Sign in method with emai; and password
  signUp(email: string, password: string) {
    this.dbAuth.auth.createUserWithEmailAndPassword(email, password)
        .then( (response) => {

          //add the user to the 'users' collection
          let user = {
            username: response.user.email,
            id: response.user.uid,
            role: 'user'
          }

          // add user newly created to the database
          this.db.collection('Users').add(user)
              .then( user => { 
                user.get().then( x=> {
                  // return the user data
                  console.log(x.data());

                  this.currentUser = x.data();
                  console.log('Current user', this.currentUser);

                  //Set currentUser status
                this.setUserStatus(this.currentUser);
                  this.router.navigate(["/doctors"]);
                })
              })
        }).catch(error => {
          console.log(error);
        }).catch(error => {
          console.log("An error occured: ", error);
        })
  }

  login(username: string, password: string) {
    this.dbAuth.auth.signInWithEmailAndPassword(username, password)
        .then( (user) => {
          this.db.collection('Users').ref.where('username', '==', username).onSnapshot(snap => {
            snap.forEach( userRef => {
              this.currentUser = userRef.data();
              console.log('current user', this.currentUser);

              // Set the user status
              this.setUserStatus(this.currentUser);
              
              // set the current user to local storage
              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
              if(userRef.data().role !== 'admin') {
                this.router.navigate(['/doctors']);
              } else {
                this.router.navigate(['/dashboard']);
              }
            })
          })
        }).catch(error => error);

    // return this.db.collection('Users', ref => ref.where('username', '==', username)).snapshotChanges().pipe(
    //   map(changes => {
    //     return changes.map(a => {
    //       const data = a.payload.doc.data() as Users;
    //       this.setUserStatus(data);
    //       return data;
    //     });
    //   })
    // );
  }

  logout() {
    this.dbAuth.auth.signOut().then(() => {
      console.log('user sign out');

      // Set the current user to null to be logged out
      this.currentUser = null;

      // Set the listener to be null, for the UI to react
      this.setUserStatus(null);

      this.router.navigate(["/login"]);

      //Remove the current user from local storage
      localStorage.removeItem('currentUser');
    }).catch(error => {
      console.log('An error occured: ', error);
    });

  }

  userChanges() {
    this.dbAuth.auth.onAuthStateChanged(currentUser => {
      if(currentUser) {
        this.db.collection('Users').ref.where('username', '==', currentUser.email).onSnapshot(snap => {
          snap.forEach( userRef => {
            this.currentUser = userRef.data();
            console.log('current user', this.currentUser);

            // Set the user status
            this.setUserStatus(this.currentUser);
            
            // set the current user to local storage
            //localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            if(userRef.data().role !== 'admin') {
               this.ngZone.run(() => this.router.navigate(['/doctors']));
            } else {
              this.ngZone.run(() => this.router.navigate(['/dashboard']));
            }
          })
        })
      } else {
        this.router.navigate(['/login']);
      }
    })
  }
}
