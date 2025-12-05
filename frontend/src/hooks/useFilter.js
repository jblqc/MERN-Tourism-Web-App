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
    fetchHomepageStats,
    homepageStats,
  } = useFilterStore();

  // ==== SAFE FORMATTER ====
  const formatStat = (num) => {
    if (!num || isNaN(num)) return "0";
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num.toString();
  };

  // ==== FORMATTED VALUES READY FOR UI ====
  const formattedStats = homepageStats
    ? {
        totalTours: `${homepageStats.totalTours || 0}+`,
        totalReviews: formatStat(homepageStats.totalReviews),
        totalBookings: formatStat(homepageStats.totalBookings),
        topCountries:
          homepageStats.topCountries?.filter((c) => c.country) || [],
        topRatedTours: homepageStats.topRatedTours || [],
        guideCount: homepageStats.guideCount || 0,
      }
    : null;

  return {
    filters,
    filteredTours,
    loading,
    setFilter,
    clearFilter,
    clearAllFilters,
    applyFilters,
    fetchHomepageStats,

    // NEW
    homepageStats,
    formattedStats,
  };
};
