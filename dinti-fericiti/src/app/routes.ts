import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { DoctorsComponent } from './dashboard/doctors/doctors.component';
import { DoctorComponent } from './doctor/doctor.component';


export const appRoutes: Routes = [
  { path: 'signup', component: SignupFormComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin']},
  },
  { path: 'doctors', component: DoctorsComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard], data: {roles: ['user']}},
  { path: '', redirectTo: 'login', pathMatch: 'full', data: { roles: ['user', 'admin'] } }
];
