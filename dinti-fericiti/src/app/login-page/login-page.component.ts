import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { Users } from '../models/user';
import { analytics, auth } from 'firebase';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  // Properties
  loginForm: FormGroup;
  user: Users;
  authenticated: Observable<any>;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32)
        ]
        ]
      }
    );
  }

  login() {
    if (this.loginForm.valid) {
      this.user = Object.assign({}, this.loginForm.value);
      this.authService.login(this.user.username, this.user.password).subscribe( data => {
            console.log(data);
            localStorage.setItem('userName', data[0].username);
            localStorage.setItem('password', data[0].password);
            localStorage.setItem('role', data[0].role);
            if (data[0].role === 'admin') {
              this.router.navigate(['/dashboard']);
              console.log('it is admin');

            } else {
              console.log('it is user');
            }
      });
      console.log(this.authService.userStatus);
    }
  }

}
