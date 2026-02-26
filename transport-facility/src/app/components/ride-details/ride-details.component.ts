/*
 * RideDetailsComponent
 * small modal showing ride data with book/close actions.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ride } from '../../models/ride.model';
import { AuthService } from '../../services/auth.service';
import { RideService } from '../../services/ride.service';

@Component({
  selector: 'app-ride-details',
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.scss'],
})
export class RideDetailsComponent {
  @Input() ride: Ride | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() booked = new EventEmitter<void>();

  constructor(
    private auth: AuthService,
    private rides: RideService,
  ) {}

  canBook(): boolean {
  const user = this.auth.getCurrentUser();

  if (
    !this.ride ||
    !user ||
    this.ride.creatorId === user ||
    this.ride.bookings.includes(user) ||
    this.ride.vacantSeats <= 0
  ) {
    return false;
  }

  return true;
}

  doBook() {
    if (!this.ride) {
      return;
    }
    const user = this.auth.getCurrentUser();
    if (!user) {
      alert('Please login to book');
      return;
    }
    const res = this.rides.bookRide(this.ride.id, user);
    if (!res.ok) {
      alert(res.message || 'Booking failed');
      return;
    }
    alert('Booked successfully');
    this.booked.emit();
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
