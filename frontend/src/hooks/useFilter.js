import { useFilterStore } from "../store/useFilterStore";

export const useFilter = () => {
  const {
    filters,
    filteredTours,
    loading,
    setFilter,
    clearFilter,
    clearAllFilters,
    applyFilters,
  } = useFilterStore();

  return {
    filters,
    filteredTours,
    loading,
    setFilter,
    clearFilter,
    clearAllFilters,
    applyFilters,
  };
};
