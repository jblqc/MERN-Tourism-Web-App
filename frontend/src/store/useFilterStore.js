// src/store/useFilterStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAllTours, getHomepageStats } from "../api/tourApi";

export const useFilterStore = create(
  devtools((set, get) => ({
    // =============================
    //      FILTER STATE
    // =============================
    filters: {
      search: "",
      country: "",
      priceMin: "",
      priceMax: "",
      dateFrom: "",
      dateTo: "",
    },

    filteredTours: [],
    loading: false,

    setFilter: (key, value) =>
      set({
        filters: {
          ...get().filters,
          [key]: value,
        },
      }),

    clearFilter: (key) =>
      set({
        filters: {
          ...get().filters,
          [key]: "",
        },
      }),

    clearAllFilters: () =>
      set({
        filters: {
          search: "",
          country: "",
          priceMin: "",
          priceMax: "",
          dateFrom: "",
          dateTo: "",
        },
        filteredTours: [],
      }),

    buildQueryString: () => {
      const p = new URLSearchParams();
      const f = get().filters;
      if (f.search) p.append("search", f.search);
      if (f.country) p.append("country", f.country);
      if (f.priceMin !== "") p.append("price[gte]", f.priceMin);
      if (f.priceMax !== "") p.append("price[lte]", f.priceMax);
      if (f.dateFrom) p.append("startDateFrom", f.dateFrom);
      if (f.dateTo) p.append("startDateTo", f.dateTo);
      return p.toString();
    },

    // APPLY FILTERS -> Fetch tours
    applyFilters: async () => {
      set({ loading: true });
      try {
        const qs = get().buildQueryString();
        const data = await getAllTours(qs);
        set({ filteredTours: data });
        return data;
      } finally {
        set({ loading: false });
      }
    },

    // =============================
    //      HOMEPAGE STATS STATE
    // =============================

    homepageStats: null,
    statsLoading: false,
    statsError: null,

    // Fetch homepage stats
    fetchHomepageStats: async () => {
      set({ statsLoading: true, statsError: null });
      try {
        const stats = await getHomepageStats();
        set({ homepageStats: stats, statsLoading: false });
        return stats;
      } catch (err) {
        set({
          statsLoading: false,
          statsError:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load homepage stats",
        });
      }
    },
  }))
);
