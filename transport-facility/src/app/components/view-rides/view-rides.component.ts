/*
 * RideListComponent
 * shows a list of today's rides with filtering options.
 * Written manually to mirror a user‑facing page.
 */
import { Component, OnInit } from '@angular/core';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ride-list',
  templateUrl: './view-rides.component.html',
  styleUrls: ['./view-rides.component.scss']
})
export class RideListComponent implements OnInit {
  all: Ride[] = [];
  displayed: Ride[] = [];
  vehicleFilter: 'All' | 'Bike' | 'Car' = 'All';
  selectedTime = '';
  cities: string[] = [];
  filteredOrigins: string[] = [];
  filteredDestinations: string[] = [];
  origin = '';
  destination = '';
  selectedRide: Ride | null = null;

  constructor(private rides: RideService, private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    this.selectedTime = `${hh}:${mm}`;
    this.loadCities();
    this.reload(false);
  }

  private loadCities() {
    this.http.get<string[]>('/assets/india-cities.json').subscribe({
      next: data => {
        this.cities = (data || []).slice().sort((a, b) => a.localeCompare(b));
        this.filteredOrigins = [];
        this.filteredDestinations = [];
      },
      error: () => { this.cities = []; this.filteredOrigins = []; this.filteredDestinations = []; }
    });
  }

  filterOrigins(q: string) {
    const input = (q || '').toLowerCase().trim();
    if (!input) {
      this.filteredOrigins = [];
      return;
    }
    const matches = this.cities.filter(c => c.toLowerCase().includes(input));
    if (matches.length === 0) {
      this.filteredOrigins = ['No location found'];
    } else {
      this.filteredOrigins = matches.slice(0, 3);
    }
  }

  filterDestinations(q: string) {
    const input = (q || '').toLowerCase().trim();
    if (!input) {
      this.filteredDestinations = [];
      return;
    }
    const matches = this.cities.filter(c => c.toLowerCase().includes(input));
    if (matches.length === 0) {
      this.filteredDestinations = ['No location found'];
    } else {
      this.filteredDestinations = matches.slice(0, 3);
    }
  }


  reload(applyFilters = false) {
    // grab rides that were created today only
    this.all = this.rides.getTodayRides();
    if (applyFilters) {
      this.applyFilters();
    } else {
      this.displayed = [...this.all];
    }
  }

  applyFilters() {
    const bufferMins = 60;
    // treat selectedTime as center and allow +/- buffer minutes around it
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
    // display time with space around colon for readability
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
