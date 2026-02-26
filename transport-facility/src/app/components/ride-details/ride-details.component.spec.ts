import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideDetailsComponent } from './ride-details.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RideDetailsComponent', () => {
  let component: RideDetailsComponent;
  let fixture: ComponentFixture<RideDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA] // ignore template errors
    }).compileComponents();

    fixture = TestBed.createComponent(RideDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should return false if ride is null', () => {
    component.ride = null;
    expect(component.canBook()).toBeFalse();
  });

});