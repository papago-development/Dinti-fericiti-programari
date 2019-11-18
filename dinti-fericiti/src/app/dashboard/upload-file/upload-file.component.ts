import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Files } from 'src/app/models/files';
import { PatientService } from 'src/app/services/patient.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { url } from 'inspector';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';


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

  constructor(private dbStorage: AngularFireStorage,
              private patientService: PatientService,
              private db: AngularFirestore,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.params.id;
    this.patientService.getPatientById(this.patientId).subscribe(data => {
      this.files = data.files;
    });
  }

  onFileSelected(event) {

    // create a reference to the storage bucket location
    const file = event.target.files[0];
    const filePath = this.patientId;
    const ref = this.dbStorage.ref(filePath);
    const task = this.dbStorage.upload(filePath, file);

    console.log(this.files);

    const fileNew: Files = {
      url: '',
      filename: file.name
    };
    console.log(fileNew);

    this.files.push(fileNew);

    console.log('files', this.files);


    // this.user.push(this.files);
    this.patientService.addFileToPatient(this.patientId, this.files);

  }
}
