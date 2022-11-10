import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarArticuloNotaCreditoComponent } from './agregar-articulo-nota-credito.component';

describe('AgregarArticuloNotaCreditoComponent', () => {
  let component: AgregarArticuloNotaCreditoComponent;
  let fixture: ComponentFixture<AgregarArticuloNotaCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarArticuloNotaCreditoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarArticuloNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
