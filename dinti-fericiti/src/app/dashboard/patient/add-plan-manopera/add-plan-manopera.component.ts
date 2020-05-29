import { ToastrService } from 'ngx-toastr';
import { PatientService } from './../../../services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { PlanManopera } from './../../../models/planManopera';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Doctor } from './../../../models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';
import { PlanManoperaService } from './../../../services/plan-manopera.service';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs';

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
  planManopera: PlanManopera[] = [];
  manoperaList: any[] = [];
  config: any;
  planManoperaCounter: number = 0;

  patientId: string;
  arr: any[] = [];

  @Input() cnpPacient: string;

  constructor(private planManoperaService: PlanManoperaService,
              private doctorService: DoctorService,
              private patientService: PatientService,
              private route: ActivatedRoute,
              private toastrService: ToastrService) {
                this.config = {
                  itemsPerPage: 10,
                  currentPage: 1,
                  totalItems: this.planManoperaCounter
                };

  }

  ngOnInit() {
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
    this.planManoperaService.getPlanManopereByCNP(this.patientId)
      .subscribe(data => {
        this.planManopera = data;
        data.forEach(element => {
          this.planManoperaCounter += 1;
        });
      });
  }

  pageChange(event) {
    this.config.currentPage = event;
  }

  add() {
    this.planManopera = Object.assign({}, this.planManoperaForm.value);
    this.patientService.updatePlanToPatient(this.patientId, this.planManopera).then(() => {
      this.planManoperaForm.reset();
    });
  }

  getManopera() {
    this.manoperaList = this.planManoperaService.getPlanManopera();
  }

  onSelected(item: any, $event) {
  }

  deleteManopera(manoperaId, patientId) {

    this.planManoperaService.deletePlanManopera(manoperaId, patientId).then(() => {
      this.toastrService.success('Planul manoperei a fost sters cu success.');
    }).catch(error => {
      console.error(error);
    });
  }
}
