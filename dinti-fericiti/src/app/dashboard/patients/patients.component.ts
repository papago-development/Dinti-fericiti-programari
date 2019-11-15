import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  // Properties
  dataSource = new MatTableDataSource<Patient>();

    // paginator is used for paginating the mat-table
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // variable for sorting the events for patient
    @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'phonePacient', 'action'];

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.loadPatients();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe( data => {
      this.dataSource.data = data as any[];
    });
  }

    // filter data from patients table
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
