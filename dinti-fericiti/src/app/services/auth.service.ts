import { Router, ActivatedRoute } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: any;
  public userStatus: string;
  public userStatusChages: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);
  public userId: number;

  constructor(private db: AngularFirestore, private dbAuth: AngularFireAuth,
              private router: Router, private ngZone: NgZone,
              private route: ActivatedRoute, private toastr: ToastrService) { }

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChages.next(userStatus);
  }

  // Sign in method with emai; and password
  signUp(email: string, password: string, doctorName: string) {
    this.dbAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((response) => {

        // add the user to the 'users' collection
        const user = {
          name: doctorName,
          username: response.user.email,
          id: response.user.uid,
          role: 'user'
        };

        // add user newly created to the database
        this.db.collection('Users').add(user)
          // tslint:disable-next-line: no-shadowed-variable
          .then(user => {
            user.get().then(x => {
              // return the user data
              // console.log(x.data());

              this.currentUser = x.data();
              //  console.log('Current user', this.currentUser);

              // Set currentUser status
              this.setUserStatus(this.currentUser);
              this.router.navigate(['/doctor/', user.id]);
            });
          });
      }).catch(error => {
        console.log(error);
      }).catch(error => {
        console.log('An error occured: ', error);
      });
  }

  login(username: string, password: string) {
    this.dbAuth.auth.signInWithEmailAndPassword(username, password)
      .then((user) => {
        this.db.collection('Users').ref.where('username', '==', username).onSnapshot(snap => {
          snap.forEach(userRef => {

              this.currentUser = userRef.data();
              console.log('current user from service', this.currentUser);

              // Set the user status
              this.setUserStatus(this.currentUser);

              // set the current user to local storage
              localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

              if (userRef.data().role !== 'admin') {

                this.router.navigate(['/doctor/', this.currentUser.id]);
              } else {
                this.router.navigate(['/dashboard']);
              }
          });
        });
      }).catch(error => {
        //
        console.log(error);
        this.handleError(error.code);
      });
  }

  private handleError(code: string ) {
    switch (code) {
      case 'auth/wrong-password':
      this.toastr.warning('Numele sau parola sunt gresite!');
    }
  }

  logout() {
    this.dbAuth.auth.signOut().then(() => {
      console.log('user sign out');

      // Set the current user to null to be logged out
      this.currentUser = null;

      // Set the listener to be null, for the UI to react
      this.setUserStatus(null);

      this.router.navigate(['/login']);

      // Remove the current user from local storage
      localStorage.removeItem('currentUser');
    }).catch(error => {
      console.log('An error occured: ', error);
    });

  }

  userChanges() {
    this.dbAuth.auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        this.db.collection('Users').ref.where('username', '==', currentUser.email).onSnapshot(snap => {
          snap.forEach(userRef => {
            this.currentUser = userRef.data();

            // Set the user status
            this.setUserStatus(this.currentUser);

            // set the current user to local storage
            // localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            if (userRef.data().role !== 'admin') {
              this.ngZone.run(() => this.router.navigate(['/doctor', this.currentUser.id]));
            } else {
              this.ngZone.run(() => this.router.navigate(['/dashboard']));
            }
          });
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
