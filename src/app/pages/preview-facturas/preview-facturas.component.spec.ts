import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFacturasComponent } from './preview-facturas.component';

describe('PreviewFacturasComponent', () => {
  let component: PreviewFacturasComponent;
  let fixture: ComponentFixture<PreviewFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewFacturasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
