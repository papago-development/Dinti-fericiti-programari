import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { Programare } from 'src/app/models/programare';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history-appointment',
  templateUrl: './history-appointment.component.html',
  styleUrls: ['./history-appointment.component.css']
})
export class HistoryAppointmentComponent implements OnInit, OnDestroy {

  // Properties
  patientId: any;
  events: any[] = [];
  subs: Subscription;

  constructor(private patientService: PatientService,

              private route: ActivatedRoute) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.loadHistory();
  }

  loadHistory() {
    this.subs = this.patientService.getPatientEventById(this.patientId).subscribe( data => {
      this.events = data;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
