import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { Users } from '../models/user';
import { Observable } from 'rxjs';
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
        username: ['', [Validators.required, Validators.email]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(32)
        ]
        ]
      }
    );
  }

  login() {
    if (this.loginForm.valid) {
      this.user = Object.assign({}, this.loginForm.value);
      this.authService.login(this.user.username, this.user.password);
      console.log(this.authService.userStatus);
    }
  }
  getEmailErrorMessage() {
    return  this.loginForm.controls.username.hasError('required') ? 'You must enter a value' :
            this.loginForm.controls.username.hasError('email') ? 'Not a valid email' :
            '';
  }

  getPasswordErrorMessage() {
    return  this.loginForm.controls.password.hasError('required') && this.loginForm.controls.password.touched ? 'Password is required' :
            this.loginForm.controls.password.hasError('minlength') ? 'Password must be at least 6 characters' :
            this.loginForm.controls.password.hasError('maxlength') ? 'Password cannot exceed 32 characters' :
            '';
  }
}
