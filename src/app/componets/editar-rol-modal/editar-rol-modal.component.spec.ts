import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRolModalComponent } from './editar-rol-modal.component';

describe('EditarRolModalComponent', () => {
  let component: EditarRolModalComponent;
  let fixture: ComponentFixture<EditarRolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarRolModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarRolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
