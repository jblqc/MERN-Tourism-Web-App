// src/store/useBookingStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { fetchAllBookings } from "../api/bookingApi";

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
            const data = await fetchAllBookings();
            set({ bookings: data });
          } catch (err) {
            set({ error: err.message });
          } finally {
            set({ loading: false });
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
