import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteCajaReporteComponent } from './corte-caja.component';

describe('CorteCajaReporteComponent', () => {
  let component: CorteCajaReporteComponent;
  let fixture: ComponentFixture<CorteCajaReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorteCajaReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteCajaReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
