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
          MatCheckboxModule,
          MatIconModule,
          MatStepperModule} from '@angular/material';

import { CommonModule, registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';

import { ToastrModule } from 'ngx-toastr';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { DateTimePickerModule } from 'ngx-datetime-picker';
import { NgxPaginationModule } from 'ngx-pagination';

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
import { AddPatientComponent } from './dashboard/patients/add-patient/add-patient.component';
import { AddPlanManoperaComponent } from './dashboard/patient/add-plan-manopera/add-plan-manopera.component';
import { HistoryManopereComponent } from './dashboard/history-manopere/history-manopere.component';
import { AddManoperaComponent } from './dashboard/patient/add-manopera/add-manopera.component';

registerLocaleData(localeRo);
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
      UploadFileComponent,
      AddPatientComponent,
      AddManoperaComponent,
      AddPlanManoperaComponent,
      HistoryManopereComponent
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
       MatIconModule,
       MatStepperModule,
       ToastrModule.forRoot(),
       OwlDateTimeModule,
       OwlNativeDateTimeModule,
       DateTimePickerModule,
       NgxPaginationModule
      ],
  providers: [
     { provide: OWL_DATE_TIME_LOCALE, useValue: 'ro'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
