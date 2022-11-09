import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaCreditoCrudComponent } from './nota-credito-crud.component';

describe('NotaCreditoCrudComponent', () => {
  let component: NotaCreditoCrudComponent;
  let fixture: ComponentFixture<NotaCreditoCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotaCreditoCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaCreditoCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
