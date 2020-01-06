import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentFundsComponent } from './current-funds.component';

describe('CurrentFundsComponent', () => {
  let component: CurrentFundsComponent;
  let fixture: ComponentFixture<CurrentFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
