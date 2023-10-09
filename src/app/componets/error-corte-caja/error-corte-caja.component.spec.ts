import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorCorteCajaComponent } from './error-corte-caja.component';

describe('ErrorCorteCajaComponent', () => {
  let component: ErrorCorteCajaComponent;
  let fixture: ComponentFixture<ErrorCorteCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorCorteCajaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorCorteCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
