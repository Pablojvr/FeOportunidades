import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsModalComponent } from './tabs-modal.component';

describe('TabsModalComponent', () => {
  let component: TabsModalComponent;
  let fixture: ComponentFixture<TabsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
