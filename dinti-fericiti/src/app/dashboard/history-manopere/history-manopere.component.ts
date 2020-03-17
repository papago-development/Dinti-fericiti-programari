import { ManoperaService } from './../../services/manopera.service';
import { Manopera } from './../../models/manopera';
import { Component, OnInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-history-manopere',
  templateUrl: './history-manopere.component.html',
  styleUrls: ['./history-manopere.component.css']
})
export class HistoryManopereComponent implements OnInit, OnChanges, OnDestroy {

  // Properties
  patientId: string;
  manopere: any[] = [];
  manopereSubscription: Subscription;
  dataSource = new MatTableDataSource<Manopera>();
  displayedColumns: string[] = ['medic', 'manopera', 'data', 'tehnician'];

    // variable for sorting the events for patient
    @ViewChild(MatSort) sort: MatSort;

    // paginator is used for paginating the mat-table
    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private manopereService: ManoperaService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');

    this.loadManopere();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.loadManopere();
  }

  ngOnDestroy() {
    if (this.manopereSubscription) {
      this.manopereSubscription.unsubscribe();
    }
  }

  loadManopere() {
    this.manopereSubscription = this.manopereService.getItemFromDatabaseByCNP(this.patientId)
                                                            .subscribe(data => {
                                                              // this.manopere = data;
                                                              this.dataSource.data = data as any[];
                                                              console.log('plan manopera', this.manopere);
    });
  }

}
