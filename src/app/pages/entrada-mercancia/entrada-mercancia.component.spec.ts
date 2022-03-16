import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaMercanciaComponent } from './entrada-mercancia.component';

describe('EntradaMercanciaComponent', () => {
  let component: EntradaMercanciaComponent;
  let fixture: ComponentFixture<EntradaMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntradaMercanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
