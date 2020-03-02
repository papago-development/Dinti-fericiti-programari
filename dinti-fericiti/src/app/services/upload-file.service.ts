import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Files } from '../models/files';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  //Properties
  private files: Array<Files> = [];
  private url: Observable<string | null>;

  constructor(private dbStorage: AngularFireStorage,
              private db: AngularFirestore,
              private route: ActivatedRoute) { }

  onFileSelected(event) {
    console.log('event upload', event);
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

          });
        }).catch(err => console.log('Error', err));
  }
}
