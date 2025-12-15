// src/api/bookingApi.js
import axiosClient from "./axiosClient";

export const createCheckoutSession = async (tourId) => {
  const res = await axiosClient.get(`/booking/checkout-session/${tourId}`);
  return res.data.url;
};
export const fetchMyBookings = async () => {
  const res = await axiosClient.get("/booking/my-bookings");
  return res.data.data.bookings;
};