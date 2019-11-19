import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Files } from 'src/app/models/files';
import { PatientService } from 'src/app/services/patient.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Patient } from 'src/app/models/patient';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  counter: any = 0;
  files: Array<Files> = [];
  user: any[] = [];
  url: Observable<string>;
  patientId;

  dataSource = new MatTableDataSource<Patient>();
  displayedColumns: string[] = ['filename'];

  // paginator is used for paginating the mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // variable for sorting the events for patient
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dbStorage: AngularFireStorage,
              private patientService: PatientService,
              private db: AngularFirestore,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.patientId = this.route.snapshot.params.id;
    this.patientService.getPatientById(this.patientId).subscribe(data => {
      this.files = data.files;
      this.dataSource.data = data.files as Patient[];
    });
  }

  onFileSelected(event) {

    // create a reference to the storage bucket location
    const file = event.target.files[0];
    const filePath = this.patientId;
    const ref = this.dbStorage.ref(filePath);
    const task = this.dbStorage.upload(filePath, file);

    console.log(this.files);

    ref.getDownloadURL().subscribe(data => {
      this.url = data;

      const fileNew: Files = {
        url: this.url,
        filename: file.name
      };

      this.files.push(fileNew);

      console.log("files", this.files);

      this.patientService.addFileToPatient(this.patientId, this.files);
    });
  }
}
