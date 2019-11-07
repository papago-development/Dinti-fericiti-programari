import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  // Properties
  patients:any[] = [];

  constructor(private patientService: PatientService) { }

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAllPatients().subscribe( data => {
      this.patients = data;
      console.log(this.patients);
    });
  }

}
