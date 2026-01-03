// src/store/usePackageStore.js
import { create } from "zustand";
import { getAllPackage, getPackageById } from "../api/packageApi";

export const usePackageStore = create((set) => ({
  packages: [],
  currentPackage: null,
  loading: false,
  error: null,

  fetchPackages: async () => {
    set({ loading: true });
    try {
      const data = await getAllPackage();
      set({ packages: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPackageById: async (id) => {
    set({ loading: true });
    try {
      const data = await getPackageById(id);
      set({ currentPackage: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
