import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  getAllTours,
  getTourById,
  getTop5Cheap,
  getMonthlyPlan,
  getTourStats,
  getDistances,
  updateTour,
  deleteTour,
  createTour,
} from "../api/tourApi";

export const useTourStore = create(
  devtools(
    persist(
      (set, get) => ({
        tours: [],
        currentTour: null,
        stats: [],
        topTours: [],
        monthlyPlan: [],
        distances: [],
        loading: false,
        error: null,
        setCurrentTour: (tour) => set({ currentTour: tour }), // <-- ⭐ FIX ADDED

        /* ---------------------------------
         * FETCH ALL TOURS
         * --------------------------------- */
        fetchTours: async () => {
          set({ loading: true });
          try {
            const res = await getAllTours();
            set({ tours: res.data.doc }); // ✅ FIX
          } catch (err) {
            set({ error: err.message });
          } finally {
            set({ loading: false });
          }
        },

        /* ---------------------------------
         * FETCH BY ID
         * --------------------------------- */
        fetchTourById: async (id) => {
          set({ loading: true });
          try {
            const res = await getTourById(id);
            set({ currentTour: res.data.doc }); // ✅ FIX
            return res.data.doc;
          } catch (err) {
            set({ error: err.message });
          } finally {
            set({ loading: false });
          }
        },

        /* ---------------------------------
         * TOP 5 CHEAP
         * --------------------------------- */
        fetchTopTours: async () => {
          set({ loading: true });
          try {
            const res = await getTop5Cheap();
            set({ topTours: res.data.doc }); // ✅ FIX
          } catch (err) {
            set({ error: err.message });
          } finally {
            set({ loading: false });
          }
        },

        /* ---------------------------------
         * STATS
         * --------------------------------- */
        fetchStats: async () => {
          try {
            const res = await getTourStats();
            set({ stats: res.data.stats }); // ✅ FIX
          } catch (err) {
            set({ error: err.message });
          }
        },

        /* ---------------------------------
         * MONTHLY PLAN
         * --------------------------------- */
        fetchMonthlyPlan: async (year) => {
          try {
            const res = await getMonthlyPlan(year);
            set({ monthlyPlan: res.data.plan }); // ✅ FIX
          } catch (err) {
            set({ error: err.message });
          }
        },

        /* ---------------------------------
         * DISTANCES
         * --------------------------------- */
        fetchDistances: async (lat, lng, unit) => {
          try {
            const res = await getDistances(lat, lng, unit);
            set({ distances: res.data }); // backend returns {data: distances}
          } catch (err) {
            set({ error: err.message });
          }
        },

        /* ---------------------------------
         * CRUD (ADMIN)
         * --------------------------------- */
        createTour: async (body) => {
          const res = await createTour(body);
          set({ tours: [...get().tours, res.data.tour] }); // ✅ FIX
        },

        updateTour: async (id, body) => {
          const res = await updateTour(id, body);
          const updated = res.data.doc;

          set({
            tours: get().tours.map((t) => (t._id === id ? updated : t)),
            currentTour: updated,
          });
        },

        deleteTour: async (id) => {
          await deleteTour(id);
          set({ tours: get().tours.filter((t) => t._id !== id) });
        },
      }),
      { name: "tour-storage", getStorage: () => localStorage }
    ),
    { name: "TourStore" }
  )
);
