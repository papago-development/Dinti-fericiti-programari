import { forEach } from '@angular/router/src/utils/collection';
import { ActivatedRoute } from '@angular/router';
import { PlanManopera } from './../../../models/planManopera';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Doctor } from './../../../models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { PlanManoperaService } from './../../../services/plan-manopera.service';
import { Component, OnInit, OnChanges, Input, ElementRef, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-add-plan-manopera',
  templateUrl: './add-plan-manopera.component.html',
  styleUrls: ['./add-plan-manopera.component.css']
})
export class AddPlanManoperaComponent implements OnInit, OnChanges {

  // Properties
  doctors: Doctor[] = [];
  doctorSubscription: Subscription;
  planManoperaForm: FormGroup;
  planManopera: PlanManopera;
  manoperaList: any[] = [];
  manopere: Array<any> = [];
  patientId: string;
  arr: any[] = [];

  @Input() cnpPacient: ElementRef;

  constructor(private planManoperaService: PlanManoperaService,
              private doctorService: DoctorService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('cpn', this.cnpPacient);
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.createForm();
    this.loadDoctors();
    this.getManopera();
    this.loadManopere();
  }

  ngOnChanges() {
    this.getManopera();
  }

  createForm() {

    this.planManoperaForm = new FormGroup({
      manopera: new FormControl(null, Validators.required),
      medic: new FormControl(null, Validators.required),
      isFinished: new FormControl(false)
    });
  }

  loadDoctors() {
    this.doctorSubscription = this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  loadManopere() {
    // this.manopere = this.planManoperaService.getItemFromDatabaseByCNP(this.patientId);
    // console.log('manopere', this.manopere);
    // this.planManoperaService.getItemFromDatabaseByCNP(this.patientId)
    // .subscribe(data => {
    //   this.manopere = data;
    //   console.log('manopere', this.manopere);
    //   console.log('manopere 1', JSON.stringify(this.manopere));
    // });
  }

  addPlanManopera() {
    // this.planManopera = Object.assign({}, this.planManoperaForm.value);
    // console.log('plan manopera', this.planManopera);
    // this.planManoperaService.addManopera(this.planManopera);
    // window.alert('Manopera a fost adaugata cu success');
  }

  add() {
    this.planManopera = Object.assign({}, this.planManoperaForm.value);
    this.planManoperaService.add(this.planManopera);
    this.planManoperaForm.reset();
  }

  getManopera() {
    this.manoperaList = this.planManoperaService.getManopera();
  }
}
