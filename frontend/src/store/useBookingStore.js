import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getBookings, deleteBooking } from "../api/bookingApi";
import { bookTour } from "../api/bookingApi";

export const useBookingStore = create(
  devtools(
    persist(
      (set, get) => ({
        bookings: [],
        loading: false,
        error: null,

        fetchBookings: async () => {
          set({ loading: true });
          try {
            const data = await getBookings();
            set({ bookings: data });
          } catch (err) {
            set({ error: err.message });
          } finally {
            set({ loading: false });
          }
        },

        createBooking: async (tourId, date) => {
          try {
            const data = await bookTour(tourId, date);
            set({ bookings: [...get().bookings, data] });
          } catch (err) {
            throw err.response?.data?.message || "Booking failed";
          }
        },

        removeBooking: async (id) => {
          try {
            await deleteBooking(id);
            set({ bookings: get().bookings.filter((b) => b._id !== id) });
          } catch (err) {
            throw err.response?.data?.message || "Failed deleting booking";
          }
        },
      }),
      {
        name: "booking-storage",
        getStorage: () => localStorage,
      }
    ),
    { name: "BookingStore" }
  )
);
