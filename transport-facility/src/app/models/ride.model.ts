export type VehicleType = 'Bike' | 'Car';

export interface Ride {
  id: string;
  creatorId: string;
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  time: string; // stored as HH:mm
  pickUp: string;
  destination: string;
  createdAt: string; // ISO timestamp when ride was created
  bookings: string[]; // employee IDs who booked
}
