import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarArticuloFacturaModalComponent } from './agregar-articulo-factura-modal.component';

describe('AgregarArticuloFacturaModalComponent', () => {
  let component: AgregarArticuloFacturaModalComponent;
  let fixture: ComponentFixture<AgregarArticuloFacturaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarArticuloFacturaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarArticuloFacturaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
