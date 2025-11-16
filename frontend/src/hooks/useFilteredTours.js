// src/hooks/useFilteredTours.js
import { useMemo } from "react";

export const useFilteredTours = (tours, filters) =>
  useMemo(() => {
    return tours.filter((tour) => {
      if (filters.city && tour.startLocation?.description !== filters.city)
        return false;
      if (filters.priceRange && tour.price > filters.priceRange.max)
        return false;
      return true;
    });
  }, [tours, filters]);
