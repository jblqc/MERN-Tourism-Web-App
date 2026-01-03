import axiosClient from "./axiosClient";

// Create review
export const createReview = async (data) => {
  const res = await axiosClient.post("/reviews", data);
  return res.data.data.review;
};

// Get all reviews
export const getAllReviews = async () => {
  const res = await axiosClient.get("/reviews");
  return res.data.data.reviews;
};

// Get review by ID
export const getReview = async (id) => {
  const res = await axiosClient.get(`/reviews/${id}`);
  return res.data.data.review;
};

// Update review
export const updateReview = async (id, body) => {
  const res = await axiosClient.patch(`/reviews/${id}`, body);
  return res.data.data.review;
};

// Delete review
export const deleteReview = async (id) => {
  return axiosClient.delete(`/reviews/${id}`);
};

// Get reviews of a specific tour
export const getReviewsByTour = async (tourId) => {
  const res = await axiosClient.get(`/tours/${tourId}/reviews`);
  return res.data.data.doc;
};
