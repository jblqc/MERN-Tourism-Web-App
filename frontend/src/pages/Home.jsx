// src/pages/Home.jsx
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Tabs,
  TabList,
  Tab,
  Input,
  Select,
  Button,
  Grid,
  GridItem,
  Image,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FiSearch, FiStar } from "react-icons/fi";
import { MdFilterAltOff } from "react-icons/md";
import { useTour } from "../hooks/useTours";
import { useFilter } from "../hooks/useFilter";
import { useState } from "react";
import TourCard from "../components/TourCard";
import GlassBox from "../components/GlassBox";
import { useNavigate } from "react-router-dom";
import { useTourStore } from "../store/useTourStore";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import defaultImg from "../assets/default.jpg";
import Filter from "../components/Filter";

export default function Home() {
  const {
    filters,
    setFilter,
    applyFilters,
    clearAllFilters,
    fetchHomepageStats,
    formattedStats,
  } = useFilter();

  const {
    tours,
    featuredTours,
    miniGridTours,
    countries,
    fetchCountries,
    fetchTours,
    stats,
    loading,
    fetchMonthlyPlan,
  } = useTour();
  const loaded = useRef(false);

  const blurStyle = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };
  const navigate = useNavigate();
  const setCurrentTour = useTourStore((state) => state.setCurrentTour);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const handleClick = (tour) => {
    setCurrentTour(tour);
    navigate(`/tour/${tour.slug}`);
  };
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    fetchHomepageStats();

    fetchTours();
    fetchCountries();
    clearAllFilters(); // Clear only when landing on Home
  }, []);
  const CountUp = ({ end, duration = 1200 }) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      let start = 0;
      const endValue = parseInt(end.replace(/[^0-9]/g, "")) || 0;
      if (endValue === 0) return setValue(0);

      const increment = endValue / (duration / 16);

      const handle = setInterval(() => {
        start += increment;
        if (start >= endValue) {
          clearInterval(handle);
          setValue(endValue);
        } else {
          setValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(handle);
    }, [end]);

    return <>{value.toLocaleString()}</>;
  };
  const countryFlag = (name) => {
    const flags = {
      Philippines: "🇵🇭",
      Japan: "🇯🇵",
      France: "🇫🇷",
      Thailand: "🇹🇭",
      Nepal: "🇳🇵",
    };
    return flags[name] || "🌍";
  };
  const ratingColor = (rating) => {
    if (rating >= 4.8) return "green.400";
    if (rating >= 4.5) return "yellow.400";
    return "orange.400";
  };
const success = new URLSearchParams(window.location.search).get("success");

  const StatCard = ({ value, label, icon }) => (
    <VStack
      bg="white"
      p={5}
      borderRadius="xl"
      shadow="md"
      _hover={{ shadow: "xl", transform: "translateY(-px)" }}
      transition="0.2s"
    >
      <Icon as={icon} boxSize={8} color="purple.400" />
      <Heading fontSize="4xl" fontWeight="bold">
        {value}
      </Heading>
      <Text fontSize="lg" color="gray.600">
        {label}
      </Text>
    </VStack>
  );

  if (loading)
    return (
      <Container textAlign="center" py={10}>
        <Text>Loading tours...</Text>
      </Container>
    );

  if (!tours.length)
    return (
      <Container textAlign="center" py={10}>
        <Text>No tours available.</Text>
      </Container>
    );
  return (
    <Box>
      {/* HERO SECTION */}
      <Modal isOpen={openCalendar} onClose={() => setOpenCalendar(false)}>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="lg">
          <ModalHeader>Select Date Range</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={range}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              onClick={() => {
                setFilter(
                  "dateFrom",
                  range[0].startDate.toISOString().split("T")[0]
                );
                setFilter(
                  "dateTo",
                  range[0].startDate.toISOString().split("T")[0]
                );
                setOpenCalendar(false);
              }}
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        w="100%"
        h="100vh"
        backgroundImage="url(/img/origbg.webp)"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        color="white"
      >
        <VStack
          position="relative"
          top="40%"
          transform="translateY(-40%)"
          spacing={6}
          textAlign="center"
          zIndex="1"
        >
          <Heading fontSize={["3xl", "5xl"]} fontWeight="extrabold">
            Make Travel Easy,
            <br /> Enjoy More Fun
          </Heading>
          <Text fontSize="lg" maxW="lg">
            Experience travel that's simple, exciting, and worry-free.
          </Text>

          {/* Filter Card */}
          <Filter mode="home" />
        </VStack>
      </Box>
{success && (
  <Box
    bg="green.50"
    border="1px solid"
    borderColor="green.200"
    borderRadius="lg"
    p={4}
    mb={6}
  >
    <Heading size="md" color="green.600">
      🎉 Booking Confirmed!
    </Heading>
    <Text>Your tour has been successfully booked.</Text>
  </Box>
)}

      {/* HOMEPAGE STATS SECTION */}
      <Container maxW="7xl" py={20} textAlign="center">
        <Heading mb={2}>Trusted by travelers around the globe.</Heading>
        <Text color="gray.600" mb={10}>
          Real numbers from our growing community.
        </Text>

        {/* MAIN COUNTS */}
        <SimpleGrid columns={[1, 3]} spacing={10} mb={16}>
          <StatCard
            value={<CountUp end={formattedStats?.totalTours || "0"} />}
            label="Tours Available"
            icon={FiSearch}
          />

          <StatCard
            value={<CountUp end={formattedStats?.totalReviews || "0"} />}
            label="Verified Reviews"
            icon={FiStar}
          />

          <StatCard
            value={<CountUp end={formattedStats?.totalBookings || "0"} />}
            label="Successful Bookings"
            icon={FiSearch}
          />
        </SimpleGrid>

        {/* TOP COUNTRIES */}
        <Heading size="md" mb={6}>
          Where People Travel Most
        </Heading>

        <HStack justify="center" spacing={4} wrap="wrap" mb={14}>
          {formattedStats?.topCountries?.length > 0 ? (
            formattedStats.topCountries.map((c) => (
              <Box
                key={c.country}
                px={4}
                py={2}
                borderRadius="full"
                bg="purple.50"
                color="purple.600"
                fontWeight="semibold"
                shadow="sm"
              >
                {countryFlag(c.country)} {c.country}
              </Box>
            ))
          ) : (
            <Text>No country data available</Text>
          )}
        </HStack>

        {/* TOP TOURS */}
        <Heading size="md" mb={6}>
          Top Rated Adventures
        </Heading>

        <SimpleGrid columns={[1, 3]} spacing={6}>
          {formattedStats?.topRatedTours?.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </SimpleGrid>
      </Container>

      {/* IMAGE GRID */}
      <Container maxW="7xl" py={20}>
        <Heading textAlign="center" mb={2}>
          Unveil the incredible experiences that await you
        </Heading>
        <Text textAlign="center" color="gray.600" mb={12}>
          at your thoughtfully selected destinations.
        </Text>

        <Grid templateColumns={["1fr", "2fr 3fr"]} gap={6}>
          <GridItem
            bgImage={`url(/img/lbg-1.jpg)`}
            bgSize="cover"
            bgPos="center"
            borderRadius="xl"
            position="relative"
            minH="700px"
            overflow="hidden"
          >
            <VStack
              position="absolute"
              top="70%"
              left="10%"
              transform="translateY(-50%)"
              align="flex-start"
              color="white"
              spacing={6}
            >
              <Heading fontSize="5xl" fontWeight="bold" lineHeight="1.3">
                Soak in the <br /> beauty of
                <br /> nature.
              </Heading>

              {/* oval image slider */}
              <HStack
                bg="rgb(255, 255, 255)"
                borderRadius="full"
                p={1}
                w="100%"
                h="40%"
                spacing="2"
                overflow="hidden"
                {...blurStyle}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Image
                    key={n}
                    src={`/img/lbg-${n}.jpg`}
                    w="60px"
                    h="40px"
                    objectFit="cover"
                    borderRightRadius={n === 5 ? "full" : "5"}
                    borderLeftRadius={n === 1 ? "full" : "5"}
                  />
                ))}
              </HStack>
            </VStack>
          </GridItem>

          {/* Right Grid */}
          <GridItem>
            <SimpleGrid columns={[1, 2]} spacing={10} h="100%">
              {miniGridTours.map((tour) => (
                <Box
                  key={tour._id}
                  bg="white"
                  onClick={() => handleClick(tour)} // ★ FIX
                  _hover={{
                    transform: "translateY(-3px)",
                    transition: "0.3s",
                  }}
                >
                  <Box position="relative">
                    <Image
                      src={tour.imageCover}
                      alt={tour.name}
                      fallbackSrc={defaultImg}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      borderRadius={15}
                    />
                    <Box
                      position="absolute"
                      top="10px"
                      right="10px"
                      bg="white"
                      px={2.5}
                      py={1}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap={1}
                      boxShadow="sm"
                    >
                      <Icon as={FiStar} color="yellow.400" boxSize={4} />
                      <Text fontWeight="bold" fontSize="sm">
                        {tour.ratingsAverage?.toFixed(1) || "4.9"}
                      </Text>
                    </Box>
                  </Box>

                  <Box px={4} py={4}>
                    <HStack justify="space-between" mb={1}>
                      <Heading fontSize="md" noOfLines={1}>
                        {tour.name}
                      </Heading>
                      <Text fontWeight="semibold" color="gray.700">
                        ${tour.price.toLocaleString()}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500" noOfLines={2}>
                      {tour.summary}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Container>

      {/* CTA FOOTER */}
      <Box
        // bgImage={`url(${heroImage})`}
        bgImage={`url(./public/img/lbg-4.jpg)`}
        bgSize="cover"
        bgPos="center"
        py={40}
        textAlign="center"
        color="white"
        position="relative"
      >
        <Box position="absolute" inset="0" bg="rgba(0, 0, 0, 0.55)" />
        <VStack position="relative" spacing={6}>
          <Heading fontSize={["3xl", "5xl"]}>
            Begin your exciting adventure into nature today.
          </Heading>
          <Button size="lg" colorScheme="purple" borderRadius={"full"}>
            Sign Up
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
