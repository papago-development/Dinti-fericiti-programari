import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientsComponent } from './dashboard/patients/patients.component';
import { PatientComponent } from './dashboard/patient/patient.component';


export const appRoutes: Routes = [
  { path: 'signup', component: SignupFormComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin']},
  },
  { path: 'doctor/:id', component: DoctorComponent, canActivate: [AuthGuard], data: {roles: ['user']}},
  { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard], data: {roles: ['admin', 'user']}},
  {path: 'patient/:id', component: PatientComponent, canActivate: [AuthGuard], data: {roles: ['admin', 'user']}},

  { path: '', redirectTo: 'login', pathMatch: 'full', data: { roles: ['user', 'admin'] } }
];
