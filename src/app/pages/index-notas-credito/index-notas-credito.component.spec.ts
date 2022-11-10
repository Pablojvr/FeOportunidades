import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexNotasCreditoComponent } from './index-notas-credito.component';

describe('IndexNotasCreditoComponent', () => {
  let component: IndexNotasCreditoComponent;
  let fixture: ComponentFixture<IndexNotasCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexNotasCreditoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexNotasCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
