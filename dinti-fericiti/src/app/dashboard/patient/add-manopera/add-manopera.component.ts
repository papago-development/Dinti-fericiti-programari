import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { ManoperaService } from './../../../services/manopera.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-manopera',
  templateUrl: './add-manopera.component.html',
  styleUrls: ['./add-manopera.component.css']
})
export class AddManoperaComponent implements OnInit, OnDestroy {

  // Properties
  doctors: Doctor[] = [];
  manoperaForm: FormGroup;
  doctorsSubscription: Subscription;


  constructor(private manoperaService: ManoperaService,
              private doctorService: DoctorService) { }

  ngOnInit() {
    this.createForm();
    this.loadDoctors();
  }

  ngOnDestroy() {
    if (this.doctorsSubscription) {
      this.doctorsSubscription.unsubscribe();
    }
  }

  createForm() {
    this.manoperaForm = new FormGroup({
      cnp: new FormControl(null, Validators.required),
      manopera: new FormControl(null, Validators.required),
      medic: new FormControl(null, Validators.required),
      data: new FormControl(null, Validators.required)
    });
  }

  loadDoctors() {
    this.doctorsSubscription = this.doctorService.getDoctors().subscribe(data => {
      this.loadDoctors = data;
    });
  }

  addManopera() {

  }

}
