import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OPOOOHistoryComponent } from './op-oo-ohistory.component';

describe('OPOOOHistoryComponent', () => {
  let component: OPOOOHistoryComponent;
  let fixture: ComponentFixture<OPOOOHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OPOOOHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OPOOOHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
