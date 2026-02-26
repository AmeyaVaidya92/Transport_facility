/*
 * AddRideComponent
 * lets an employee post a ride they're planning to take.
 * Written by a human—no code generator here—kept simple for clarity.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RideService } from '../../services/ride.service';
import { AuthService } from '../../services/auth.service';
import { VehicleType } from '../../models/ride.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

function timeValidator(control: AbstractControl) {
  const v = control.value || '';
  if (!/^\d{1,2}:\d{2}$/.test(v)) {
    return { timeFormat: true };
  }
  const [hh, mm] = v.split(':').map((s: string) => Number(s));
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    return { timeInvalid: true };
  }
  return null;
}

@Component({
  selector: 'app-add-ride',
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.scss'],
})
export class AddRideComponent {
  form: FormGroup;
  vehicleTypes: VehicleType[] = ['Bike', 'Car'];
  cities: string[] = [];
  filteredPickups: string[] = [];
  filteredDestinations: string[] = [];

  // vehicle number pattern: e.g. MH34VB1000 or MH34 VB 1000
  private vehiclePattern = /^[A-Za-z]{2}\s?\d{1,2}\s?[A-Za-z]{1,2}\s?\d{1,4}$/;

  constructor(
    private fb: FormBuilder,
    private rides: RideService,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      vehicleType: ['Bike', Validators.required],
      vehicleNo: [
        '',
        [
          Validators.required,
          Validators.pattern(this.vehiclePattern),
          Validators.maxLength(10),
        ],
      ],
      vacantSeats: [
        '1',
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      time: ['', [Validators.required, timeValidator]],
      pickUp: ['', Validators.required],
      destination: ['', Validators.required],
    });

    this.setDefaultTime();
    this.loadCities();
  }

  ngOnInit(): void {}

  private setDefaultTime() {
    // default time is current time
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    this.form.patchValue({ time: `${hh}:${mm}` });
  }

  private loadCities() {
    this.http.get<string[]>('/assets/india-cities.json').subscribe({
      next: (data) => {
        this.cities = (data || []).slice().sort((a, b) => a.localeCompare(b));
        this.filteredPickups = this.cities.slice(0, 3);
        this.filteredDestinations = this.cities.slice(0, 3);
      },
      error: () => {
        this.cities = [];
        this.filteredPickups = [];
        this.filteredDestinations = [];
      },
    });
  }

  filterPickups(q: string) {
    const input = (q || '').toLowerCase().trim();
    if (!input) {
      // no data show first three cities
      this.filteredPickups = this.cities.slice(0, 3);
      return;
    }
    const matches = this.cities.filter((c) => c.toLowerCase().includes(input));
    if (matches.length === 0) {
      this.filteredPickups = ['No location found'];
    } else {
      this.filteredPickups = matches.slice(0, 3);
    }
  }

  filterDestinations(q: string) {
    const input = (q || '').toLowerCase().trim();
    if (!input) {
      this.filteredDestinations = this.cities.slice(0, 3);
      return;
    }
    const matches = this.cities.filter((c) => c.toLowerCase().includes(input));
    if (matches.length === 0) {
      this.filteredDestinations = ['No location found'];
    } else {
      this.filteredDestinations = matches.slice(0, 3);
    }
  }

  swapCities() {
    // swapping of 2 cities
    const pickup = this.form.get('pickUp')?.value;
    const destination = this.form.get('destination')?.value;
    this.form.patchValue({
      pickUp: destination || '',
      destination: pickup || '',
    });
  }

  submit() {
    const user = this.auth.getCurrentUser();
    if (!user) {
      alert('Please login first');
      this.router.navigate(['/login']);
      return;
    }
    if (this.form.invalid) {
      alert('Please fix form errors');
      return;
    }

    const value = this.form.value;
    // evalidating the cities
    if (this.cities.length && !this.cities.includes(value.pickUp)) {
      alert('Pick-up must be a valid city from India list');
      return;
    }
    if (this.cities.length && !this.cities.includes(value.destination)) {
      alert('Destination must be a valid city from India list');
      return;
    }
    const res = this.rides.addRide({
      creatorId: user,
      vehicleType: value.vehicleType,
      vehicleNo: String(value.vehicleNo).toUpperCase().replace(/\s+/g, ''),
      vacantSeats: parseInt(value.vacantSeats, 10),
      time: value.time,
      pickUp: value.pickUp.trim(),
      destination: value.destination.trim(),
    });
    if (!res.ok) {
      alert(res.message || 'Could not add ride');
      return;
    }
    alert('Ride added');
    this.router.navigate(['/rides']);
  }

  openTimePicker(ev: FocusEvent) {
    const input = ev.target as HTMLInputElement;
    if (input && typeof (input as any).showPicker === 'function') {
      (input as any).showPicker();
    }
  }
}
