import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarArticuloDevolucionModalComponent } from './agregar-articulo-devolucion-modal.component';

describe('AgregarArticuloDevolucionModalComponent', () => {
  let component: AgregarArticuloDevolucionModalComponent;
  let fixture: ComponentFixture<AgregarArticuloDevolucionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarArticuloDevolucionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarArticuloDevolucionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
