// src/pages/TourDetail.jsx
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  Container,
  Divider,
  Spinner,
  Avatar,
  Stack,
  useColorModeValue,
  Badge,
  Icon,
} from "@chakra-ui/react";
import defaultImg from "../assets/default.jpg";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { createCheckoutSession } from "../api/bookingApi";
import { useTour } from "../hooks/useTours";
import { useAuth } from "../hooks/useAuth";
import { buildAssetUrl } from "../config/env";

import {
  FiClock,
  FiUsers,
  FiStar,
  FiCheck,
  FiInfo,
  FiMapPin,
} from "react-icons/fi";

import MapBox from "./MapBox";
import ReviewCard from "../components/ReviewCard";
import { useReviews } from "../hooks/useReviews";

export default function TourDetail() {
  const { slug } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    tour,
    tours,
    fetchTourBySlug,
    setCurrentTour,
    loading: tourLoading,
  } = useTour();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { reviews, fetchReviewsByTour, loading: reviewLoading } = useReviews();

  const [selectedDate, setSelectedDate] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const interval = setInterval(() => {
      if (mapRef.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setShowMap(true);
              observer.disconnect();
              clearInterval(interval);
            }
          },
          { rootMargin: "400px 0px", threshold: 0.01 }
        );

        observer.observe(mapRef.current);
      }
    }, 160);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    if (!slug) return;

    let isActive = true;

    const loadTour = async () => {
      const cached = tours.find((item) => item.slug === slug);
      const selectedTour = cached || (await fetchTourBySlug(slug));

      if (!isActive || !selectedTour?._id) return;

      if (cached) {
        setCurrentTour(cached);
      }

      fetchReviewsByTour(selectedTour._id);
    };

    loadTour();

    return () => {
      isActive = false;
    };
  }, [fetchReviewsByTour, fetchTourBySlug, setCurrentTour, slug, tours]);

  const highlights = useMemo(
    () =>
      [
        tour?.startLocation?.description &&
          `Start in ${tour.startLocation.description}`,
        tour?.country && `Discover ${tour.country}`,
        typeof tour?.duration === "number" && `${tour.duration} day itinerary`,
        typeof tour?.maxGroupSize === "number" &&
          `Small groups up to ${tour.maxGroupSize}`,
      ].filter(Boolean),
    [
      tour?.country,
      tour?.duration,
      tour?.maxGroupSize,
      tour?.startLocation?.description,
    ]
  );

  // ---------------------------------------
  // LOADING STATES
  // ---------------------------------------
  if (tourLoading || reviewLoading)
    return (
      <VStack py={20}>
        <Spinner size="xl" color="teal.400" />
        <Text>Loading tour details...</Text>
      </VStack>
    );

  if (!tour) return <Text textAlign="center">Tour not found.</Text>;

  // ---------------------------------------
  // SMALL COMPONENT
  // ---------------------------------------
  const InfoBox = ({ icon, color, title, value }) => (
    <Box
      bg={cardBg}
      boxShadow="sm"
      borderRadius="lg"
      p={{ base: 4, md: 6 }}
      border={`1px solid ${borderColor}`}
    >
      <Stack
        direction={{ base: "row", md: "column" }}
        spacing={{ base: 4, md: 3 }}
        align={{ base: "center", md: "center" }}
        justify={{ base: "flex-start", md: "center" }}
      >
        <Box
          bg={`${color}.100`}
          color={`${color}.500`}
          minW={{ base: 12, md: 10 }}
          w={{ base: 12, md: 10 }}
          h={{ base: 12, md: 10 }}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon as={icon} boxSize={5} />
        </Box>
        <Box textAlign={{ base: "left", md: "center" }}>
          <Text fontWeight="semibold" color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            {title}
          </Text>
          <Text fontWeight="bold" fontSize={{ base: "xl", md: "lg" }} mt={1}>
            {value}
          </Text>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box bg={bg} pt={{ base: "76px", md: "84px" }} pb={{ base: 12, md: 16 }}>
      {/* HEADER IMAGE */}
      <Box position="relative" h={{ base: "360px", md: "460px", lg: "560px" }}>
        <Image
          src={tour.imageCover}
          alt={tour.name}
          fallbackSrc={defaultImg}
          w="100%"
          h="100%"
          objectFit="cover"
          filter="brightness(55%)"
        />
        <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(15,23,42,0.16), rgba(15,23,42,0.7))" />
        <VStack
          position="absolute"
          left={{ base: 4, md: "50%" }}
          right={{ base: 4, md: "auto" }}
          bottom={{ base: 8, md: "50%" }}
          transform={{ base: "none", md: "translate(-50%, 50%)" }}
          maxW={{ base: "100%", md: "700px" }}
          align={{ base: "flex-start", md: "center" }}
          textAlign={{ base: "left", md: "center" }}
          color="white"
          spacing={{ base: 4, md: 5 }}
          zIndex={1}
        >
          <Badge
            borderRadius="full"
            px={3}
            py={1}
            bg="whiteAlpha.260"
            color="white"
            textTransform="capitalize"
            fontSize="xs"
            letterSpacing="0.08em"
          >
            {tour.country || "Featured tour"}
          </Badge>
          <Heading
            fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
            lineHeight={{ base: 0.95, md: 1 }}
            maxW={{ base: "280px", sm: "360px", md: "640px" }}
          >
            {tour.name}
          </Heading>
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={{ base: 2, sm: 6 }}
            fontWeight="medium"
            fontSize={{ base: "sm", md: "md" }}
            align={{ base: "flex-start", md: "center" }}
          >
            <HStack spacing={2}>
              <FiClock />
              <Text>{tour.duration} days</Text>
            </HStack>
            <HStack spacing={2}>
              <FiMapPin />
              <Text noOfLines={2}>{tour.startLocation?.description}</Text>
            </HStack>
          </Stack>
        </VStack>
      </Box>

      <Container
        maxW="7xl"
        px={{ base: 4, md: 6 }}
        mt={{ base: -8, md: -10 }}
        position="relative"
        zIndex={2}
      >
        <Grid templateColumns={{ base: "1fr", lg: "minmax(0, 1.7fr) minmax(320px, 0.9fr)" }} gap={{ base: 6, md: 8, lg: 10 }}>
          <GridItem>
            {/* ABOUT */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="2xl" p={{ base: 5, md: 8 }} mb={6}>
              <Heading fontSize={{ base: "2xl", md: "xl" }} mb={3}>
                About This Tour
              </Heading>
              <Text color={textColor} fontSize={{ base: "lg", md: "md" }} lineHeight="1.8">
                {tour.summary}
              </Text>
            </Box>

            {/* INFO BOXES */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={{ base: 4, md: 6 }} mb={6}>
              <InfoBox
                icon={FiClock}
                color="blue"
                title="Duration"
                value={`${tour.duration} Days`}
              />
              <InfoBox
                icon={FiUsers}
                color="green"
                title="Group Size"
                value={`Max ${tour.maxGroupSize}`}
              />
              <InfoBox
                icon={FiStar}
                color="purple"
                title="Difficulty"
                value={tour.difficulty}
              />
            </SimpleGrid>

            {/* HIGHLIGHTS */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="2xl" p={{ base: 5, md: 8 }} mb={6}>
              <Heading fontSize={{ base: "2xl", md: "xl" }} mb={4}>
                Tour Highlights
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {highlights.map((highlight, i) => (
                  <HStack
                    key={i}
                    bg="gray.50"
                    borderRadius="xl"
                    p={3}
                    spacing={3}
                    align="flex-start"
                  >
                    <Box
                      bg="green.100"
                      color="green.500"
                      w={6}
                      h={6}
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FiCheck} />
                    </Box>
                    <Text color={textColor} lineHeight="1.5">
                      {highlight}
                    </Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>

            {/* GUIDES */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="2xl" p={{ base: 5, md: 8 }} mb={6}>
              <Heading fontSize={{ base: "2xl", md: "xl" }} mb={4}>
                Your Guides
              </Heading>
              <Stack spacing={4}>
                {tour.guides?.map((g) => (
                  <HStack
                    key={g._id}
                    spacing={4}
                    align="center"
                    p={3}
                    borderRadius="xl"
                    bg="gray.50"
                  >
                    <Avatar
                      src={buildAssetUrl(`/img/users/${g.photo}`)}
                      name={g.name}
                      size={{ base: "md", md: "lg" }}
                    />
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="bold">{g.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {g.role === "lead-guide" ? "Lead Guide" : "Tour Guide"}
                      </Text>
                    </VStack>
                  </HStack>
                ))}
              </Stack>
            </Box>

            {/* GALLERY */}
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4} mb={6}>
              {tour.images?.map((img, i) => (
                <AspectRatio key={img} ratio={4 / 3}>
                  <Image
                    src={img}
                    alt={`${tour.name}-${i}`}
                    fallbackSrc={defaultImg}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="xl"
                    shadow="md"
                  />
                </AspectRatio>
              ))}
            </SimpleGrid>

            {/* MAP */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="2xl" p={{ base: 5, md: 8 }} mb={6}>
              <Heading fontSize={{ base: "2xl", md: "xl" }} mb={4}>
                Tour Location
              </Heading>

              <Box ref={mapRef} minH={{ base: "260px", md: "340px" }} w="100%">
                {showMap ? (
                  <MapBox locations={tour.locations} />
                ) : (
                  <Flex
                    h="100%"
                    minH={{ base: "260px", md: "340px" }}
                    w="100%"
                    align="center"
                    justify="center"
                    color="gray.400"
                    bg="gray.50"
                    borderRadius="xl"
                  >
                    Loading map...
                  </Flex>
                )}
              </Box>
            </Box>

            {/* REVIEWS */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="2xl" p={{ base: 5, md: 8 }}>
              <Stack
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                spacing={{ base: 3, md: 4 }}
                mb={4}
              >
                <HStack>
                  <Icon as={FiInfo} color="gray.700" boxSize={5} />
                  <Text fontWeight="bold" fontSize={{ base: "xl", md: "lg" }}>
                    Reviews ({reviews.length})
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiStar} color="yellow.400" boxSize={5} />
                  <Text fontSize={{ base: "2xl", md: "xl" }} fontWeight="bold">
                    {tour.ratingsAverage?.toFixed(1) || "4.9"}
                  </Text>
                  <Text color="gray.500">/ 5</Text>
                </HStack>
              </Stack>

              {reviews.length ? (
                reviews.map((r) => <ReviewCard key={r._id} review={r} />)
              ) : (
                <Text color="gray.500">No reviews yet for this tour.</Text>
              )}
            </Box>
          </GridItem>

          {/* BOOKING SIDEBAR */}
          <GridItem order={{ base: -1, lg: 0 }}>
            <Box
              position={{ base: "static", lg: "sticky" }}
              top="100px"
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              p={{ base: 5, md: 8 }}
            >
              <Stack
                direction={{ base: "column", sm: "row", lg: "column" }}
                justify="space-between"
                align={{ base: "flex-start", sm: "center", lg: "stretch" }}
                spacing={{ base: 3, lg: 0 }}
              >
                <Box>
                  <Text fontSize={{ base: "3xl", md: "4xl", lg: "3xl" }} fontWeight="bold">
                    ${tour.price}{" "}
                    <Text
                      as="span"
                      fontWeight="medium"
                      color="gray.500"
                      fontSize={{ base: "md", md: "lg" }}
                    >
                      / person
                    </Text>
                  </Text>
                  <Text mt={2} color="gray.600" maxW="300px">
                    Pick your date and reserve your slot before it fills up.
                  </Text>
                </Box>

                <Badge colorScheme="green" px={3} py={1.5} borderRadius="full">
                  Flexible booking
                </Badge>
              </Stack>

              <Text mt={6} fontWeight="semibold">
                Select Start Date
              </Text>
              <VStack mt={4} spacing={3} align="stretch">
                {tour.startDates?.map((date) => {
                  const formatted = new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });
                  const isSelected = selectedDate === date;
                  return (
                    <Button
                      key={date}
                      h="auto"
                      py={4}
                      bg={isSelected ? "black" : "white"}
                      color={isSelected ? "white" : "gray.800"}
                      border="1px solid"
                      borderColor="gray.200"
                      justifyContent="space-between"
                      rightIcon={isSelected ? <Icon as={FiCheck} /> : null}
                      onClick={() => setSelectedDate(date)}
                      whiteSpace="normal"
                      textAlign="left"
                    >
                      {formatted}
                    </Button>
                  );
                })}
              </VStack>

              <Divider my={6} />

              <HStack justify="space-between" mb={2}>
                <Text color="gray.600">Duration</Text>
                <Text fontWeight="medium">{tour.duration} days</Text>
              </HStack>

              <HStack justify="space-between" mb={2}>
                <Text color="gray.600">Max Group Size</Text>
                <Text fontWeight="medium">{tour.maxGroupSize} people</Text>
              </HStack>

              <HStack justify="space-between" mb={4}>
                <Text color="gray.600">Difficulty</Text>
                <Badge colorScheme="red" px={2} textTransform="capitalize">
                  {tour.difficulty}
                </Badge>
              </HStack>

              <Button
                size="lg"
                bg={!selectedDate ? "gray.400" : "black"}
                color="white"
                w="100%"
                isDisabled={!selectedDate}
                _hover={!selectedDate ? {} : { bg: "gray.800" }}
                onClick={async () => {
                  if (!isLoggedIn) {
                    navigate("/login");
                    return;
                  }

                  try {
                    const checkoutUrl = await createCheckoutSession(tour._id);
                    window.location.href = checkoutUrl;
                  } catch (err) {
                    console.error("Booking error:", err);
                  }
                }}
              >
                {!isLoggedIn
                  ? "Login to Book"
                  : selectedDate
                  ? "Confirm Booking"
                  : "Select a Date First"}
              </Button>

              <VStack spacing={1} fontSize="sm" color="gray.500" mt={4} align="stretch">
                <HStack align="flex-start">
                  <Icon as={FiCheck} mt={0.5} />
                  <Text>Free cancellation up to 24 hours before</Text>
                </HStack>
                <HStack align="flex-start">
                  <Icon as={FiClock} mt={0.5} />
                  <Text>Reserve now, pay later</Text>
                </HStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
