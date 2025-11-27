import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  Select,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useEffect } from "react";
import TourCard from "../components/TourCard";
import { useTour } from "../hooks/useTours";
import { useFilter } from "../hooks/useFilter";
import { useNavigate } from "react-router-dom";

export default function Tours() {
  const navigate = useNavigate();

  // FILTERS
  const {
    filters,
    filteredTours,
    loading: loadingFilter,
    setFilter,
    applyFilters,
  } = useFilter();

  // TOURS
  const { tours, fetchTours, countries, fetchCountries, loading: loadingTours } =
    useTour();

  // First load only all tours + countries
  useEffect(() => {
    fetchTours();
    fetchCountries();
  }, []);

  // Use filtered results if available, otherwise all tours
  const results = filteredTours.length > 0 ? filteredTours : tours;

  const loading = loadingTours || loadingFilter;

  return (
    <Box py={10}>
      {/* PAGE TITLE */}
      <Container maxW="7xl" mb={8}>
        <Heading fontWeight="bold" mb={2}>
          {results.length} Tours Found
        </Heading>
        <Text color="gray.600">
          Explore our curated adventures and discover your next journey.
        </Text>
      </Container>

      {/* FILTER BAR */}
      <Container maxW="7xl" mb={10}>
        <Box
          bg="white"
          p={6}
          borderRadius="xl"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <SimpleGrid columns={[1, 5]} spacing={4}>
            {/* SEARCH */}
            <Input
              placeholder="Find a Destination"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
            />

            {/* PRICE */}
            <Select
              placeholder="Price Range"
              onChange={(e) => {
                const value = e.target.value;
                if (!value) {
                  setFilter("priceMin", "");
                  setFilter("priceMax", "");
                  return;
                }
                if (value === "$0-$500") {
                  setFilter("priceMin", 0);
                  setFilter("priceMax", 500);
                } else if (value === "$500-$1000") {
                  setFilter("priceMin", 500);
                  setFilter("priceMax", 1000);
                } else if (value === "$1000+") {
                  setFilter("priceMin", 1000);
                  setFilter("priceMax", "");
                }
              }}
            >
              <option>$0-$500</option>
              <option>$500-$1000</option>
              <option>$1000+</option>
            </Select>

            {/* COUNTRY */}
            <Select
              placeholder="All Countries"
              value={filters.country}
              onChange={(e) => setFilter("country", e.target.value)}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            {/* DATE */}
            <Select
              placeholder="Date Range"
              onChange={(e) => {
                const val = e.target.value;

                if (!val) {
                  setFilter("dateFrom", "");
                  setFilter("dateTo", "");
                  return;
                }

                if (val === "Jan 2025") {
                  setFilter("dateFrom", "2025-01-01");
                  setFilter("dateTo", "2025-01-31");
                } else if (val === "Feb 2025") {
                  setFilter("dateFrom", "2025-02-01");
                  setFilter("dateTo", "2025-02-29");
                }
              }}
            >
              <option>Jan 2025</option>
              <option>Feb 2025</option>
            </Select>

            {/* APPLY FILTER BUTTON */}
            <Button
              colorScheme="purple"
              rightIcon={<FiSearch />}
              onClick={applyFilters}
            >
              Discover
            </Button>
          </SimpleGrid>
        </Box>
      </Container>

      {/* RESULTS GRID */}
      <Container maxW="7xl">
        {loading ? (
          <Text>Loading tours...</Text>
        ) : results.length === 0 ? (
          <Text>No tours match your filters.</Text>
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={8}>
            {results.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
