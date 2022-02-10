import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuarioModalComponent } from './editar-usuario-modal.component';

describe('EditarUsuarioModalComponent', () => {
  let component: EditarUsuarioModalComponent;
  let fixture: ComponentFixture<EditarUsuarioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarUsuarioModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarUsuarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
