import { useBookingStore } from "../store/useBookingStore";

export const useBookings = () => {
  const {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    removeBooking,
  } = useBookingStore();

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    removeBooking,
  };
};
