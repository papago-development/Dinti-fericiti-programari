import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {  MatInputModule,
          MatButtonModule,
          MatListModule,
          MatTabsModule,
          MatDialogModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatCardModule,
          MatSelectModule,
          MatTableModule,
          MatPaginatorModule,
          MatSortModule,
          MatButtonToggleModule,
          MatCheckboxModule} from '@angular/material';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { appRoutes } from './routes';
import { LoginPageComponent } from './login-page/login-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientsComponent } from './dashboard/patients/patients.component';
import { PatientComponent } from './dashboard/patient/patient.component';
import { HistoryAppointmentComponent } from './dashboard/history-appointment/history-appointment.component';
import { UploadFileComponent } from './dashboard/upload-file/upload-file.component';


@NgModule({
   declarations: [
      AppComponent,
      NavbarComponent,
      LoginPageComponent,
      DashboardComponent,
      SignupFormComponent,
      CalendarHeaderComponent,
      DoctorComponent,
      PatientsComponent,
      PatientComponent,
      HistoryAppointmentComponent,
      UploadFileComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      CommonModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule,
      AngularFireAuthModule,
      AngularFireStorageModule,
      RouterModule.forRoot(appRoutes),
      CalendarModule.forRoot({
         provide: DateAdapter,
         useFactory: adapterFactory
       }),
       FormsModule,
       ReactiveFormsModule,
       MatInputModule,
       MatButtonModule,
       MatListModule,
       MatTabsModule,
       MatDialogModule,
       MatDatepickerModule,
       MatNativeDateModule,
       MatCardModule,
       MatSelectModule,
       MatTableModule,
       MatPaginatorModule,
       MatSortModule,
       MatCheckboxModule,
       ToastrModule.forRoot()
      ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
