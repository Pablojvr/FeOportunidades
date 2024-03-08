import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteCajaReporteGeneralComponent } from './corte-caja.component';

describe('CorteCajaReporteGeneralComponent', () => {
  let component: CorteCajaReporteGeneralComponent;
  let fixture: ComponentFixture<CorteCajaReporteGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorteCajaReporteGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteCajaReporteGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
