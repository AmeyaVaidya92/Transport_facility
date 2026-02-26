/*
 * RideService
 * stores rides in localStorage and handles simple business logic.
 * Built by hand, so you can read and understand the intent easily.
 */
import { Injectable } from '@angular/core';
import { Ride } from '../models/ride.model';

const STORAGE = 'rides_v1';

@Injectable({ providedIn: 'root' })
export class RideService {
  private rides: Ride[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE);
      this.rides = raw ? JSON.parse(raw) : [];
      // if we didn't find any rides yet, add a few examples so the UI isn't empty
      if (!this.rides || this.rides.length === 0) {
        const now = new Date();
        const fmt = (d: Date) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        const make = (creator: string, minutesOffset: number, vehicleType: 'Bike' | 'Car', vehicleNo: string, seats: number, pickUp: string, destination: string) => {
          const d = new Date(now.getTime() + minutesOffset * 60000);
          return {
            id: String(Date.now() + Math.floor(Math.random() * 10000)),
            creatorId: creator,
            vehicleType,
            vehicleNo,
            vacantSeats: seats,
            time: fmt(d),
            pickUp,
            destination,
            createdAt: new Date().toISOString(),
            bookings: []
          } as Ride;
        };

        this.rides = [
          make('EMP001', -30, 'Bike', 'MH01AB1234', 2, 'Mumbai', 'Pune'),
          make('EMP002', 20, 'Car', 'MH12CD5678', 3, 'Pune', 'Mumbai'),
          make('EMP003', 60, 'Car', 'DL04EF9101', 4, 'Delhi', 'Noida'),
          make('EMP004', -90, 'Bike', 'MH20GH2345', 1, 'Nagpur', 'Bhopal')
        ];
        this.save();
      }
    } catch {
      this.rides = [];
    }
  }

  private save() {
    localStorage.setItem(STORAGE, JSON.stringify(this.rides));
  }

  getAll(): Ride[] {
    return [...this.rides];
  }

  addRide(ride: Omit<Ride, 'id' | 'createdAt' | 'bookings'>): { ok: boolean; message?: string } {
    const today = new Date().toDateString();
    // simple rule we've chosen: an employee can only offer one ride per day
    const exists = this.rides.find(r => r.creatorId === ride.creatorId && new Date(r.createdAt).toDateString() === today);
    if (exists) {
      return { ok: false, message: 'Employee already created a ride today.' };
    }
    const id = String(Date.now());
    const newRide: Ride = {
      id,
      ...ride as any,
      createdAt: new Date().toISOString(),
      bookings: []
    };
    this.rides.push(newRide);
    this.save();
    return { ok: true };
  }

  bookRide(rideId: string, employeeId: string): { ok: boolean; message?: string } {
    const r = this.rides.find(x => x.id === rideId);
    if (!r) { return { ok: false, message: 'Ride not found' }; }
    if (r.creatorId === employeeId) { return { ok: false, message: 'Creator cannot book own ride' }; }
    if (r.bookings.includes(employeeId)) { return { ok: false, message: 'Already booked' }; }
    if (r.vacantSeats <= 0) { return { ok: false, message: 'No seats available' }; }
    r.bookings.push(employeeId);
    r.vacantSeats = Math.max(0, r.vacantSeats - 1);
    this.save();
    return { ok: true };
  }

  // grab only the rides that were added today (useful for filtering)
  getTodayRides(): Ride[] {
    const today = new Date().toDateString();
    return this.rides.filter(r => new Date(r.createdAt).toDateString() === today);
  }
}
