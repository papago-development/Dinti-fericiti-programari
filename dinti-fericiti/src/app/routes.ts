import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { AuthGuard } from './guards/auth.guard';
import { SignupFormComponent } from './signup-form/signup-form.component';


export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', data: { roles: ['user', 'admin']} },
  { path: 'signup', component: SignupFormComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
  { path: 'doctors', component: DoctorsComponent, canActivate: [AuthGuard], data: {roles: ['user']} }
];
