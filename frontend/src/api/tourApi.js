import axiosClient from "./axiosClient";

// GET all tours
export const getAllTours = async (query = "") => {
  const res = await axiosClient.get(`/tours?${query}`);
  return res.data.data.doc;
};

// GET single tour (by ID)
export const getTourById = async (id) => {
  const res = await axiosClient.get(`/tours/${id}`);
  return res.data.data.data;
};

// PATCH update tour
export const updateTour = async (id, body) => {
  const res = await axiosClient.patch(`/tours/${id}`, body);
  return res.data.data.data;
};

// DELETE tour
export const deleteTour = async (id) => {
  const res = await axiosClient.delete(`/tours/${id}`);
  return res.data;
};

// POST create tour
export const createTour = async (data) => {
  const res = await axiosClient.post("/tours", data);
  return res.data.data.data;
};

// GET top 5 cheap
export const getTop5Cheap = async () => {
  const res = await axiosClient.get("/tours/top-5-cheap");
  return res.data.data.data;
};

// GET monthly plan
export const getMonthlyPlan = async () => {
  const res = await axiosClient.get("/tours/month");
  return res.data.data.plan;
};

// GET tour stats
export const getTourStats = async () => {
  const res = await axiosClient.get("/tours/tour-stats");
  return res.data.data.stats;
};

// GET tours within radius
export const getToursWithin = async (distance, lat, lng, unit) => {
  const res = await axiosClient.get(
    `/tours/tours-within/${distance}/center/${lat},${lng}/unit/${unit}`
  );
  return res.data.data.data;
};

// GET distances
export const getDistances = async (lat, lng, unit) => {
  const res = await axiosClient.get(
    `/tours/distance/${lat},${lng}/unit/${unit}`
  );
  return res.data.data.data;
};

// CREATE review for a tour
export const createReviewForTour = async (tourId, data) => {
  const res = await axiosClient.post(`/tours/${tourId}/reviews`, data);
  return res.data.data.review;
};

// GET all reviews of a tour
export const getTourReviews = async (tourId) => {
  const res = await axiosClient.get(`/tours/${tourId}/reviews`);
  return res.data.data.reviews;
};

export const getCountries = async () => {
  const res = await axiosClient.get("/tours/countries");
  return res.data.data.countries;
};
