import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Files } from '../models/files';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  //Properties
  private files: Array<Files> = [];
  private url: Observable<string | null>;

  constructor(
    private dbStorage: AngularFireStorage,
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  onFileSelected(event) {
    console.log('event upload', event);
    // create a reference to the storage bucket location
    const file = event.target.files[0];
    const filePath = '/' + file.name;
    const ref = this.dbStorage.ref(filePath);
    const task = this.dbStorage.upload(filePath, file);

    console.log(this.files);

    task
      .then(() => {
        ref.getDownloadURL().subscribe(data => {
          this.url = data;

          const fileNew: Files = {
            url: this.url,
            filename: file.name
          };

          this.files.push(fileNew);

          console.log('files', this.files);
        });
      })
      .catch(err => console.log('Error', err));
  }

  // deleteFileFromDatabase(file, patientId) {
  //   return this.db.collection('Pacienti').doc(patientId).delete(this.files);
  // }

  deleteFileFromStorage(file, filePath) {
    const storageRef = this.dbStorage.ref(filePath);
    return storageRef.child(file).delete();
  }

  deleteFileFromDatabase(fileArray, patientId) {
    return this.db
      .collection('Pacienti')
      .doc(patientId)
      .snapshotChanges()
      .pipe(
        map(items => {
          const data = items.payload.data();
          const files = data['files'];

          for (var file in files) {
            if (files.hasOwnProperty(file)) {
              console.log(files[file]['filename']);

              if (files[file]['filename'] === fileArray.filename) {
                console.log('ok');
                this.db
                  .collection('Pacienti')
                  .doc(patientId)
                  .update({
                   'files': firebase.firestore.FieldValue.arrayRemove({
                      filename: fileArray.filename,
                      url: files[file]['url']
                    })
                  }).then(() => this.toastrService.success('Fisierul a fost sters cu success.'));
              }
            }
          }
          // files.foreach(file => {
          //   if (file.filename === fileName) {
          //     this.db
          //       .collection("Pacienti")
          //       .doc(patientId)
          //       .update({
          //         files: firebase.firestore.FieldValue.arrayRemove({
          //           filename: fileName,
          //           url: file.url
          //         })
          //       });
          //   }
          // });
        })
      );
  }
}
