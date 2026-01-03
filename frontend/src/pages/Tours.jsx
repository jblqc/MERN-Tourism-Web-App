import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
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

  const { tours, countries, loading: loadingTours } = useTour();

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
            <Text>Loading...</Text>
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
