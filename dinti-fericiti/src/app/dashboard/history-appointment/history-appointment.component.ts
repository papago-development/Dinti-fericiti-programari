import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { Programare } from 'src/app/models/programare';
import { Subscription } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Patient } from 'src/app/models/patient';

@Component({
  selector: 'app-history-appointment',
  templateUrl: './history-appointment.component.html',
  styleUrls: ['./history-appointment.component.css']
})
export class HistoryAppointmentComponent implements OnInit, OnDestroy {

  // Properties
  patientId: any;
  patient: any;
  patientName: any;
  events: any[] = [];
  subs: Subscription;

  constructor(private patientService: PatientService,
              private appointmentService: AppointmentService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.getPatientName();
   // this.loadHistory();

  }

   getPatientName() {
      this.subs = this.patientService.getPatientById(this.patientId).subscribe(data => {
        this.patient = data;
        console.log('patient', data);
        console.log('1', this.patient.name);
     //   localStorage.setItem('pacientName', this.patient.name);

        this.appointmentService.getAppointmentByPatientName(this.patient.name).subscribe(res => {
          this.events = res;
          console.log('events', this.events);
        });
      });



  }

  loadHistory() {
    // console.log('2');
    this.patientName = localStorage.getItem('pacientName');
    // console.log(this.patientName);

  }

  ngOnDestroy() {
    // this.subs.unsubscribe();
  }
}
