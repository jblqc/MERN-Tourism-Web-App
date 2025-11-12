import axiosClient from './axiosClient';

export const getAllTours = async () => {
  const res = await axiosClient.get('/tours');
  return res.data.data.doc;
};

export const getTour = async (slug) => {
  const res = await axiosClient.get(`/tours/slug/${slug}`);
  return res.data.data.tour;
};
