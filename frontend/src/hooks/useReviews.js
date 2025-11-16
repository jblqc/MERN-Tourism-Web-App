// src/hooks/useReviews.js
import { useReviewStore } from "../store/useReviewStore";

export const useReviews = () => {
  const {
    reviews,
    currentReview,
    loading,
    error,
    fetchReviews,
    fetchReviewsByTour,
    createReview,
    updateReview,
    deleteReview,
    setCurrentReview,
  } = useReviewStore();

  return {
    reviews: Array.isArray(reviews) ? reviews : [],
    currentReview,
    loading,
    error,
    fetchReviews,
    fetchReviewsByTour,
    createReview,
    updateReview,
    deleteReview,
    setCurrentReview,
  };
};
