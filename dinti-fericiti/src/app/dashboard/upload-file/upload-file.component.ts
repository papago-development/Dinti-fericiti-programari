import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Files } from 'src/app/models/files';
import { PatientService } from 'src/app/services/patient.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Patient } from 'src/app/models/patient';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  counter: any = 0;
  files: Array<Files> = [];
  user: any[] = [];
  url: Observable<string | null>;
  patientId;
  updated = '';

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
      if (this.files.length > 0) {
        for (let i = 0; i < this.files.length; i++) {
          if ((this.files[i].filename === '' || this.files[i].filename === null) && this.files[i].url === null) {
            this.files.splice(i, 1);
          }
        }
      }
      console.log('files', this.files);
      this.dataSource.data = data.files as Patient[];
    });
  }

  onFileSelected(event) {
    // create a reference to the storage bucket location
    const file = event.target.files[0];
    const filePath = '/' + file.name;
    const ref = this.dbStorage.ref(filePath);
    const task = this.dbStorage.upload(filePath, file);

    console.log(this.files);

    task.then(() => {
      ref.getDownloadURL().subscribe(data => {
        this.url = data;

        const fileNew: Files = {
          url: this.url,
          filename: file.name
        };

        this.files.push(fileNew);

        console.log('files', this.files);

        try {
          this.patientService.addFileToPatient(this.patientId, this.files);
          this.updated = 'Fisierul a fost incarcat cu success';
          setTimeout(() => {
            this.updated = '';
          }, 100);
        } catch (error) {
          console.log('Error', error);
        }
      });
    }).catch(err => console.log('Error', err));
  }

  deleteFile(fileName) {
    this.patientService.deleteFileFromPatient(this.patientId, fileName);
    // this.files.forEach(data => {
    //   if (data.filename === fileName) {
    //     const index = this.files.indexOf(fileName);
    //     console.log('index', index);
    //     this.files.splice(index, 1);
    //   }
    // });
  }
}
