// src/store/useReviewStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewsByTour,
} from "../api/reviewApi";

export const useReviewStore = create(
  devtools(
    persist(
      (set, get) => ({
        reviews: [],
        currentReview: null,
        loading: false,
        error: null,

        // ----------------------------
        // Setter
        // ----------------------------
        setCurrentReview: (review) => set({ currentReview: review }),

        // ----------------------------
        // Fetch ALL reviews
        // backend: res.data.doc
        // ----------------------------
        fetchReviews: async () => {
          set({ loading: true });
          try {
            const reviewsArr = await getAllReviews();
            // getAllReviews() already returns array
            set({
              reviews: reviewsArr || [],
              loading: false,
            });
          } catch (err) {
            set({ error: err.message, loading: false });
          }
        },

        fetchReviewsByTour: async (tourId) => {
          set({ loading: true });
          try {
            const reviewsArr = await getReviewsByTour(tourId);
            // getReviewsByTour() returns array
            set({
              reviews: reviewsArr || [],
              loading: false,
            });
          } catch (err) {
            set({ error: err.message, reviews: [], loading: false });
          }
        },

        // ----------------------------
        // CREATE review
        // backend: res.data.review
        // ----------------------------
        createReview: async (body) => {
          const res = await createReview(body);
          set({
            reviews: [...get().reviews, res.data.review],
          });
        },

        // ----------------------------
        // UPDATE a review
        // backend: res.data.review
        // ----------------------------
        updateReview: async (id, body) => {
          const res = await updateReview(id, body);
          const updated = res.data.review;

          set({
            reviews: get().reviews.map((r) => (r._id === id ? updated : r)),
            currentReview: updated,
          });
        },

        // ----------------------------
        // DELETE review
        // ----------------------------
        deleteReview: async (id) => {
          await deleteReview(id);
          set({
            reviews: get().reviews.filter((r) => r._id !== id),
          });
        },
      }),
      {
        name: "review-storage",
        getStorage: () => localStorage,
      }
    )
  )
);
