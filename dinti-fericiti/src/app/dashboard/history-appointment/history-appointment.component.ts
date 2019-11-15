import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { Programare } from 'src/app/models/programare';
import { Subscription } from 'rxjs';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Patient } from 'src/app/models/patient';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

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
  subs: Subscription;

  dataSource = new MatTableDataSource<Programare>();
  displayedColumns: string[] = ['title', 'start'];

  constructor(private patientService: PatientService,
              private appointmentService: AppointmentService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.getPatientName();
  }

   getPatientName() {
      this.subs = this.patientService.getPatientById(this.patientId).subscribe(data => {
        this.patient = data;
        console.log('patient', data);
        console.log('1', this.patient.name);

        this.appointmentService.getAppointmentByPatientName(this.patient.name).subscribe(res => {
          this.dataSource.data = res as Programare[];
        });
      });
  }

  // filter data from history table
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
     this.subs.unsubscribe();
  }
}
