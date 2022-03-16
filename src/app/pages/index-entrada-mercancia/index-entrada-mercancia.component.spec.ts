import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexEntradaMercanciaComponent } from './index-entrada-mercancia.component';

describe('IndexEntradaMercanciaComponent', () => {
  let component: IndexEntradaMercanciaComponent;
  let fixture: ComponentFixture<IndexEntradaMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexEntradaMercanciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexEntradaMercanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
