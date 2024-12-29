import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCalendarTestComponent } from './medical-calendar-test.component';

describe('MedicalCalendarTestComponent', () => {
  let component: MedicalCalendarTestComponent;
  let fixture: ComponentFixture<MedicalCalendarTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalCalendarTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalCalendarTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
