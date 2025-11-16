import axiosClient from "./axiosClient";

export const getBookings = async () => {
  const res = await axiosClient.get("/booking");
  return res.data.data.bookings;
};

export const deleteBooking = async (id) => {
  return axiosClient.delete(`/booking/${id}`);
};
