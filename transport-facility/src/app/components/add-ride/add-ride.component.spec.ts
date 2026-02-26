import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AddRideComponent } from './add-ride.component';
import { RideService } from '../../services/ride.service';
import { AuthService } from '../../services/auth.service';

describe('AddRideComponent', () => {
  let component: AddRideComponent;
  let fixture: ComponentFixture<AddRideComponent>;
  let mockRideService: jasmine.SpyObj<RideService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRideService = jasmine.createSpyObj('RideService', ['addRide']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [AddRideComponent],
      providers: [
        { provide: RideService, useValue: mockRideService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default vehicle type', () => {
    expect(component.form.get('vehicleType')?.value).toBe('Bike');
  });

  it('should initialize vacant seats as 1', () => {
    expect(component.form.get('vacantSeats')?.value).toBe('1');
  });

  it('should have vehicle types array', () => {
    expect(component.vehicleTypes).toEqual(['Bike', 'Car']);
  });

  it('should invalidate empty vehicle number', () => {
    const vehicleNoControl = component.form.get('vehicleNo');
    vehicleNoControl?.setValue('');
    expect(vehicleNoControl?.invalid).toBeTrue();
  });

  it('should validate correct vehicle number format', () => {
    const vehicleNoControl = component.form.get('vehicleNo');
    vehicleNoControl?.setValue('MH34VB1000');
    expect(vehicleNoControl?.valid).toBeTrue();
  });

  it('should invalidate vacant seats less than 1', () => {
    const vacantSeatsControl = component.form.get('vacantSeats');
    vacantSeatsControl?.setValue(0);
    expect(vacantSeatsControl?.invalid).toBeTrue();
  });

  it('should invalidate vacant seats greater than 10', () => {
    const vacantSeatsControl = component.form.get('vacantSeats');
    vacantSeatsControl?.setValue(11);
    expect(vacantSeatsControl?.invalid).toBeTrue();
  });

  it('should filter pickups based on input', () => {
    component.cities = ['Mumbai', 'Delhi', 'Bangalore'];
    component.filterPickups('Mum');
    expect(component.filteredPickups).toContain('Mumbai');
  });

  it('should filter destinations based on input', () => {
    component.cities = ['Mumbai', 'Delhi', 'Bangalore'];
    component.filterDestinations('Del');
    expect(component.filteredDestinations).toContain('Delhi');
  });

  it('should swap pickup and destination', () => {
    component.form.patchValue({ pickUp: 'Mumbai', destination: 'Delhi' });
    component.swapCities();
    expect(component.form.get('pickUp')?.value).toBe('Delhi');
    expect(component.form.get('destination')?.value).toBe('Mumbai');
  });

  it('should show alert if not logged in', () => {
    spyOn(window, 'alert');
    mockAuthService.getCurrentUser.and.returnValue(null);
    component.submit();
    expect(window.alert).toHaveBeenCalledWith('Please login first');
  });

  it('should navigate to login if not logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    component.submit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show alert if form is invalid', () => {
    spyOn(window, 'alert');
    mockAuthService.getCurrentUser.and.returnValue('EMP001');
    component.form.patchValue({ vehicleNo: '' });
    component.submit();
    expect(window.alert).toHaveBeenCalledWith('Please fix form errors');
  });
});
