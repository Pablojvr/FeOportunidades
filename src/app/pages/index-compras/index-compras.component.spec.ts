import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexComprasComponent } from './index-compras.component';

describe('IndexComprasComponent', () => {
  let component: IndexComprasComponent;
  let fixture: ComponentFixture<IndexComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexComprasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
