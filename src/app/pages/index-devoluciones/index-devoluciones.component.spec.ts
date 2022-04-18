import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexDevolucionesComponent } from './index-devoluciones.component';

describe('IndexDevolucionesComponent', () => {
  let component: IndexDevolucionesComponent;
  let fixture: ComponentFixture<IndexDevolucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexDevolucionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexDevolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
