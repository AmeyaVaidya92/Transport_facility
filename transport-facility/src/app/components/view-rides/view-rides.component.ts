import { Component, OnInit } from '@angular/core';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-rides',
  templateUrl: './view-rides.component.html',
  styleUrls: ['./view-rides.component.scss']
})
export class ViewRidesComponent implements OnInit {
  all: Ride[] = [];
  displayed: Ride[] = [];
  vehicleFilter: 'All' | 'Bike' | 'Car' = 'All';
  selectedTime = '';
  timeSlots: string[] = [];
  cities: string[] = [];
  filteredOrigins: string[] = [];
  filteredDestinations: string[] = [];
  origin = '';
  destination = '';
  selectedRide: Ride | null = null;

  constructor(private rides: RideService, private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // default selected time is current time (rounded to nearest quarter)
    this.buildTimeSlots();
    const now = new Date();
    const roundedM = Math.ceil(now.getMinutes() / 15) * 15;
    if (roundedM === 60) { now.setHours(now.getHours() + 1); now.setMinutes(0); }
    else { now.setMinutes(roundedM); }
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    this.selectedTime = `${hh}:${mm}`;
    this.loadCities();
    this.reload(false);
  }

  private loadCities() {
    this.http.get<string[]>('/assets/india-cities.json').subscribe({ next: data => { this.cities = data || []; this.filteredOrigins = this.cities; this.filteredDestinations = this.cities; }, error: () => { this.cities = []; } });
  }

  filterOrigins(q: string) {
    const input = (q || '').toLowerCase();
    this.filteredOrigins = this.cities.filter(c => c.toLowerCase().includes(input)).slice(0, 20);
  }

  filterDestinations(q: string) {
    const input = (q || '').toLowerCase();
    this.filteredDestinations = this.cities.filter(c => c.toLowerCase().includes(input)).slice(0, 20);
  }

  private buildTimeSlots() {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    this.timeSlots = slots;
  }

  reload(applyFilters = false) {
    // only today's rides
    this.all = this.rides.getTodayRides();
    if (applyFilters) {
      this.applyFilters();
    } else {
      this.displayed = [...this.all];
    }
  }

  applyFilters() {
    const bufferMins = 60;
    // use selectedTime (HH:mm) as the center for buffer comparison
    const [selH, selM] = (this.selectedTime || '00:00').split(':').map(s => Number(s.trim()));
    const base = new Date();
    base.setHours(selH, selM, 0, 0);
    this.displayed = this.all.filter(r => {
      if (this.vehicleFilter !== 'All' && r.vehicleType !== this.vehicleFilter) { return false; }
      if (this.origin && r.pickUp !== this.origin) { return false; }
      if (this.destination && r.destination !== this.destination) { return false; }
      if (r.vacantSeats <= 0) { return false; }
      const [hh, mm] = (r.time || '00:00').split(':').map(s => Number(s.trim()));
      const rideDate = new Date();
      rideDate.setHours(hh, mm, 0, 0);
      const diff = Math.abs((rideDate.getTime() - base.getTime()) / 60000);
      return diff <= bufferMins;
    });
  }

  formattedTime(t: string) {
    // show as "HH : mm"
    const parts = (t || '').split(':');
    if (parts.length < 2) { return t; }
    return `${parts[0].padStart(2,'0')} : ${parts[1].padStart(2,'0')}`;
  }

  canBook(r: Ride) {
    const user = this.auth.getCurrentUser();
    if (!user) { return false; }
    if (r.creatorId === user) { return false; }
    if (r.bookings.includes(user)) { return false; }
    if (r.vacantSeats <= 0) { return false; }
    return true;
  }

  book(r: Ride) {
    const user = this.auth.getCurrentUser();
    if (!user) { alert('Please login to book'); return; }
    const res = this.rides.bookRide(r.id, user);
    if (!res.ok) { alert(res.message || 'Booking failed'); return; }
    alert('Booked successfully');
    this.reload(true);
  }

  openDetails(r: Ride) {
    this.selectedRide = r;
  }

  closeDetails() {
    this.selectedRide = null;
  }
}
