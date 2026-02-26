import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideListComponent } from './view-rides.component';
import { RideService } from '../../services/ride.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RideListComponent', () => {
  let component: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  let mockRideService: jasmine.SpyObj<RideService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRideService = jasmine.createSpyObj('RideService', [
      'getTodayRides',
      'bookRide'
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getCurrentUser'
    ]);

    mockRideService.getTodayRides.and.returnValue([]);

    await TestBed.configureTestingModule({
      declarations: [RideListComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule // prevents Http errors
      ],
      providers: [
        { provide: RideService, useValue: mockRideService },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // ignore child components
    }).compileComponents();

    fixture = TestBed.createComponent(RideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return false in canBook if user not logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    const ride: any = {
      creatorId: 'EMP002',
      bookings: [],
      vacantSeats: 2
    };

    expect(component.canBook(ride)).toBeFalse();
  });

  it('should open and close ride details', () => {
    const ride: any = { id: '1' };

    component.openDetails(ride);
    expect(component.selectedRide).toEqual(ride);

    component.closeDetails();
    expect(component.selectedRide).toBeNull();
  });

});