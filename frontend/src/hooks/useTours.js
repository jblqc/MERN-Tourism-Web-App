// src/hooks/useTour.js
import { useMemo } from "react";
import { useTourStore } from "../store/useTourStore";

export const useTour = () => {
  const {
    tours,
    currentTour,
    countries,
    loading: loadingTour,
    error,
    fetchTours,
    fetchTour: fetchTourBySlug,
    fetchTourById,
    setCurrentTour,
    fetchCountries,
    fetchStats,
    fetchMonthlyPlan,
  } = useTourStore();

  const stats = [
    { label: "Guided Tours Annually", value: "500+" },
    { label: "Satisfaction Rate", value: "90.5%" },
    { label: "Destinations", value: "150+" },
  ];

  const safeTours = Array.isArray(tours) ? tours : [];

  const shuffled = useMemo(
    () => [...safeTours].sort(() => 0.5 - Math.random()),
    [safeTours]
  );

  const featuredTours = shuffled.slice(0, 3);
  const miniGridTours = shuffled.slice(3, 7);

  const heroImage =
    safeTours.length === 0
      ? "/img/default-hero.jpg"
      : safeTours[Math.floor(Math.random() * safeTours.length)].imageCover;

  return {
    tours: safeTours,
    featuredTours,
    miniGridTours,
    heroImage,
    stats,
    countries,

    // SINGLE TOUR
    tour: currentTour,
    setCurrentTour,

    // FETCHERS
    fetchTours,
    fetchTourBySlug,
    fetchTourById,
    fetchCountries,
    fetchStats,
    fetchMonthlyPlan,

    // STATES
    loading: loadingTour,
    error,
  };
};
