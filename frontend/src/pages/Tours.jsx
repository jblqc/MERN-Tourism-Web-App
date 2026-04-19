import {
  Box,
  Container,
  Heading,
  Skeleton,
  SkeletonText,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useTour } from "../hooks/useTours";
import { useFilter } from "../hooks/useFilter";
import TourCard from "../components/TourCard";
import PageTransition from "../components/PageTransition";
import Filter from "../components/Filter";
export default function Tours() {
  const {
    filters,
    filteredTours,
    loading: loadingFilter,
    setFilter,
    applyFilters,
    clearAllFilters,
  } = useFilter();
  // useEffect(() => {
  //   clearAllFilters();
  // }, []);

  const { tours, countries, loading: loadingTours, fetchTours, fetchCountries } =
    useTour();

  useEffect(() => {
    if (!tours.length) {
      fetchTours();
    }

    if (!countries.length) {
      fetchCountries();
    }
  }, [countries.length, fetchCountries, fetchTours, tours.length]);

  const usingFilters = Object.values(filters).some((v) => v !== "");
  const results = usingFilters ? filteredTours : tours;
  const loading = loadingTours || loadingFilter;

  return (
    <PageTransition>
      <Box py={28}>
        <Container maxW="7xl" mb={8}>
          <Heading>{results.length} Tours Found</Heading>
          <Text color="gray.500">Refine your search</Text>
        </Container>

        {/* FILTER BAR */}
        <Container maxW="7xl" mb={10}>
          <Filter mode="tours"/>
        </Container>

        <Container maxW="7xl">
          {loading ? (
            <SimpleGrid columns={[1, 2, 3]} spacing={8}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} p={5} bg="white" borderRadius="2xl" boxShadow="lg">
                  <Skeleton h="220px" borderRadius="xl" mb={5} />
                  <Skeleton h="22px" mb={3} />
                  <SkeletonText noOfLines={3} spacing={3} />
                </Box>
              ))}
            </SimpleGrid>
          ) : results.length === 0 ? (
            <Text>No tours match your filters.</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={8}>
              {results.map((t) => (
                <TourCard key={t._id} tour={t} />
              ))}
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </PageTransition>
  );
}
