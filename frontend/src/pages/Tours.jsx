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
export default function Tours() {
  const {
    filters,
    filteredTours,
    loading: loadingFilter,
    setFilter,
    applyFilters,
    clearAllFilters,
  } = useFilter();
  useEffect(() => {
    clearAllFilters();
  }, []);

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
          <SimpleGrid columns={[1, 5]} spacing={4}>
            <Input
              placeholder="Find a Destination"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
            />

            <Select
              placeholder="Price Range"
              onChange={(e) => {
                const v = e.target.value;
                if (!v) {
                  setFilter("priceMin", "");
                  setFilter("priceMax", "");
                  return;
                }
                if (v === "$0-$500") {
                  setFilter("priceMin", 0);
                  setFilter("priceMax", 500);
                } else if (v === "$500-$1000") {
                  setFilter("priceMin", 500);
                  setFilter("priceMax", 1000);
                } else if (v === "$1000+") {
                  setFilter("priceMin", 1000);
                  setFilter("priceMax", "");
                }
              }}
            >
              <option>$0-$500</option>
              <option>$500-$1000</option>
              <option>$1000+</option>
            </Select>

            <Select
              placeholder="Country"
              value={filters.country}
              onChange={(e) => setFilter("country", e.target.value)}
            >
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>

            <Button
              colorScheme="purple"
              rightIcon={<FiSearch />}
              onClick={applyFilters}
            >
              Apply
            </Button>
          </SimpleGrid>
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
