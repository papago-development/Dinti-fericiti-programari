import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManoperaComponent } from './add-manopera.component';

describe('AddManoperaComponent', () => {
  let component: AddManoperaComponent;
  let fixture: ComponentFixture<AddManoperaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddManoperaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManoperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
