import axiosClient from './axiosClient';

export const bookTour = async (tourId) => {
  const session = await axiosClient.get(`/booking/checkout-session/${tourId}`);
  window.location.href = session.data.url;
};
