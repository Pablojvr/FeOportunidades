import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexFacturasComponent } from './index-facturas.component';

describe('IndexFacturasComponent', () => {
  let component: IndexFacturasComponent;
  let fixture: ComponentFixture<IndexFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexFacturasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
