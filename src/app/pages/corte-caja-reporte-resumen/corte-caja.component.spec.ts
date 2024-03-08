import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteCajaResumenComponent } from './corte-caja.component';

describe('CorteCajaResumenComponent', () => {
  let component: CorteCajaResumenComponent;
  let fixture: ComponentFixture<CorteCajaResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorteCajaResumenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteCajaResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
