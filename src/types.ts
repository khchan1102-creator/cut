export interface Service {
  id: string;
  name: string;
  duration: string;
  price: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingState {
  date: Date | null;
  serviceId: string | null;
  slotId: string | null;
}
