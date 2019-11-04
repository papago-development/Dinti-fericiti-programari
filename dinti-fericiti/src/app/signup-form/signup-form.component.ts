import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Users } from '../models/user';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  // Properties
  form: FormGroup;
  user: Users;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.createSignUpForm();
  }

  createSignUpForm() {
    this.form = this.fb.group(
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

  signup() {
    if (this.form.valid) {
      this.user = Object.assign({}, this.form.value);
      this.authService.signUp(this.user.username, this.user.password);
    }
  }

  getEmailErrorMessage() {
    return  this.form.controls.username.hasError('required') ? 'You must enter a value' :
            this.form.controls.username.hasError('email') ? 'Not a valid email' :
            '';
  }

  getPasswordErrorMessage() {
    return  this.form.controls.password.hasError('required') && this.form.controls.password.touched ? 'Password is required' :
            this.form.controls.password.hasError('minlength') ? 'Password must be at least 6 characters' :
            this.form.controls.password.hasError('maxlength') ? 'Password cannot exceed 32 characters' :
            '';
  }

}
