// src/store/useBookingStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fetchMyBookings } from "../api/bookingApi";

export const useBookingStore = create(
  devtools(
    (set) => ({
      bookings: [],
      loading: false,
      error: null,

      fetchBookings: async () => {
        set({ loading: true, error: null });

        try {
          const bookings = await fetchMyBookings();
          set({ bookings, loading: false });
        } catch (err) {
          set({
            loading: false,
            error:
              err.response?.data?.message ||
              err.message ||
              "Failed to load bookings",
          });
        }
      },

      // optional but good practice
      clearBookings: () => {
        set({ bookings: [], loading: false, error: null });
      },
    }),
    { name: "BookingStore" }
  )
);
