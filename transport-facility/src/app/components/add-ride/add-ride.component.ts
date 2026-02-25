import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RideService } from '../../services/ride.service';
import { AuthService } from '../../services/auth.service';
import { VehicleType } from '../../models/ride.model';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

function timeValidator(control: AbstractControl) {
  const v = control.value || '';
  if (!/^\d{1,2}:\d{2}$/.test(v)) { return { timeFormat: true }; }
  const [hh, mm] = v.split(':').map((s: string) => Number(s));
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) { return { timeInvalid: true }; }
  return null;
}

@Component({
  selector: 'app-add-ride',
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.scss']
})
export class AddRideComponent {
  form: FormGroup;
  vehicleTypes: VehicleType[] = ['Bike', 'Car'];
  cities: string[] = [];
  filteredPickups: string[] = [];
  filteredDestinations: string[] = [];
  timeSlots: string[] = [];

  // simple Indian vehicle number pattern: e.g. MH34VB1000 or MH34 VB 1000
  private vehiclePattern = /^[A-Za-z]{2}\s?\d{1,2}\s?[A-Za-z]{1,2}\s?\d{1,4}$/;

  constructor(
    private fb: FormBuilder,
    private rides: RideService,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      vehicleType: ['Bike', Validators.required],
      vehicleNo: ['', [Validators.required, Validators.pattern(this.vehiclePattern)]],
      vacantSeats: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
      time: ['', [Validators.required, timeValidator]],
      pickUp: ['', Validators.required],
      destination: ['', Validators.required]
    });

    this.buildTimeSlots();
    this.loadCities();
  }

  ngOnInit(): void {
    // no-op here; constructor initialized data
  }

  private buildTimeSlots() {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    this.timeSlots = slots;
    // set default to nearest quarter
    const now = new Date();
    const roundedM = Math.ceil(now.getMinutes() / 15) * 15;
    if (roundedM === 60) { now.setHours(now.getHours() + 1); now.setMinutes(0); }
    else { now.setMinutes(roundedM); }
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    this.form.patchValue({ time: `${hh}:${mm}` });
  }

  private loadCities() {
    this.http.get<string[]>('/assets/india-cities.json').subscribe({
      next: data => { this.cities = data || []; this.filteredPickups = this.cities; this.filteredDestinations = this.cities; },
      error: () => { this.cities = []; }
    });
  }

  filterPickups(q: string) {
    const input = (q || '').toLowerCase();
    this.filteredPickups = this.cities.filter(c => c.toLowerCase().includes(input)).slice(0, 20);
  }

  filterDestinations(q: string) {
    const input = (q || '').toLowerCase();
    this.filteredDestinations = this.cities.filter(c => c.toLowerCase().includes(input)).slice(0, 20);
  }

  submit() {
    const user = this.auth.getCurrentUser();
    if (!user) { alert('Please login first'); this.router.navigate(['/login']); return; }
    if (this.form.invalid) { alert('Please fix form errors'); return; }

    const value = this.form.value;
    // ensure pickup/destination are valid Indian cities from list (light validation)
    if (this.cities.length && !this.cities.includes(value.pickUp)) { alert('Pick-up must be a valid city from India list'); return; }
    if (this.cities.length && !this.cities.includes(value.destination)) { alert('Destination must be a valid city from India list'); return; }
    const res = this.rides.addRide({
      creatorId: user,
      vehicleType: value.vehicleType,
      vehicleNo: String(value.vehicleNo).toUpperCase().replace(/\s+/g, ''),
      vacantSeats: Number(value.vacantSeats),
      time: value.time,
      pickUp: value.pickUp.trim(),
      destination: value.destination.trim()
    });
    if (!res.ok) { alert(res.message || 'Could not add ride'); return; }
    alert('Ride added');
    this.router.navigate(['/rides']);
  }
}
