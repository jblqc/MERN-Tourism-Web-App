import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getAllTours } from "../api/tourApi";

export const useFilterStore = create(
  devtools(
    persist(
      (set, get) => ({
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
            filters: { ...get().filters, [key]: value },
          }),

        clearFilter: (key) =>
          set({
            filters: { ...get().filters, [key]: "" },
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
          }),

        buildQueryString: () => {
          const params = new URLSearchParams();
          const f = get().filters;

          if (f.search) params.append("search", f.search);
          if (f.country) params.append("country", f.country);

          if (f.priceMin) params.append("price[gte]", f.priceMin);
          if (f.priceMax) params.append("price[lte]", f.priceMax);

          if (f.dateFrom) params.append("startDateFrom", f.dateFrom);
          if (f.dateTo) params.append("startDateTo", f.dateTo);

          return params.toString();
        },

        applyFilters: async () => {
          set({ loading: true });
          try {
            const query = get().buildQueryString();
            const data = await getAllTours(query);
            set({ filteredTours: data });
          } finally {
            set({ loading: false });
          }
        },
      }),
      { name: "tour-filter-storage", getStorage: () => localStorage }
    )
  )
);
