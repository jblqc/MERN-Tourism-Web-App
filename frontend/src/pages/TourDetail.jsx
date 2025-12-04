// src/pages/TourDetail.jsx
import {
  Box,
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
import { useParams , useNavigate} from "react-router-dom";
import { useEffect, useState , useRef} from "react";
import { createCheckoutSession } from "../api/bookingApi";
import { useTour } from "../hooks/useTours";
import { useAuth } from "../hooks/useAuth";

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
    // Wait for persisted tours hydration
    if (tours.length === 0) return;
    const cached = tours.find((t) => t.slug === slug);
    if (cached) {
      setCurrentTour(cached);
      fetchReviewsByTour(cached._id);
      return;
    }
    // Fallback: Fetch via slug
    fetchTourBySlug(slug).then((tourFromApi) => {
      if (tourFromApi?._id) {
        fetchReviewsByTour(tourFromApi._id);
      }
    });
  }, [slug, tours]);

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
      p={6}
      textAlign="center"
      border={`1px solid ${borderColor}`}
    >
      <VStack spacing={3}>
        <Box
          bg={`${color}.100`}
          color={`${color}.500`}
          w={10}
          h={10}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={5} />
        </Box>
        <Text fontWeight="semibold" color="gray.600">
          {title}
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          {value}
        </Text>
      </VStack>
    </Box>
  );

  return (
    <Box bg={bg}>
      {/* HEADER IMAGE */}
      <Box position="relative" h={["300px", "400px", "500px"]}>
        <Image
          src={tour.imageCover}
          alt={tour.name}  
  fallbackSrc={defaultImg}

          w="100%"
          h="100%"
          objectFit="cover"
          filter="brightness(60%)"
        />
        <VStack
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          color="white"
          spacing={3}
        >
          <Heading size="2xl">{tour.name}</Heading>
          <HStack spacing={6} fontWeight="medium">
            <HStack>
              <FiClock />
              <Text>{tour.duration} days</Text>
            </HStack>
            <HStack>
              <FiMapPin />
              <Text>{tour.startLocation?.description}</Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>

      <Container maxW="7xl" py={12}>
        <Grid templateColumns={["1fr", null, "2fr 1fr"]} gap={10}>
          <GridItem>
            {/* ABOUT */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="lg" p={8} mb={8}>
              <Heading fontSize="xl" mb={3}>
                About This Tour
              </Heading>
              <Text color={textColor} fontSize="md">
                {tour.summary}
              </Text>
            </Box>

            {/* INFO BOXES */}
            <SimpleGrid columns={[1, 3]} spacing={6} mb={8}>
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
            <Box bg={cardBg} boxShadow="sm" borderRadius="lg" p={8} mb={8}>
              <Heading fontSize="xl" mb={4}>
                Tour Highlights
              </Heading>
              <SimpleGrid columns={[1, 2]} spacing={3}>
                {[
                  "Inca Trail",
                  "High mountain passes",
                  "Machu Picchu sunrise",
                  "Andean food",
                ].map((highlight, i) => (
                  <HStack
                    key={i}
                    bg="gray.50"
                    borderRadius="md"
                    p={3}
                    spacing={3}
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
                    <Text color={textColor}>{highlight}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>

            {/* GUIDES */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="lg" p={8} mb={8}>
              <Heading fontSize="xl" mb={4}>
                Your Guides
              </Heading>
              <Stack spacing={4}>
                {tour.guides?.map((g) => (
                  <HStack key={g._id}>
                    <Avatar src={`/img/users/${g.photo}`} name={g.name} />
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
            <SimpleGrid columns={[1, 2, 3]} spacing={4} mb={8}>
              {tour.images?.map((img, i) => (
                <Image
                  key={img}
                  src={img}
                  alt={`${tour.name}-${i}`}    
  fallbackSrc={defaultImg}

                  w="100%"
                  h="210px"
                  objectFit="cover"
                  borderRadius="lg"
                  shadow="md"
                />
              ))}
            </SimpleGrid>

            {/* MAP */}
<Box bg={cardBg} boxShadow="sm" borderRadius="lg" p={8} mb={8} >
  <Heading fontSize="xl" mb={4}>Tour Location</Heading>

  <Box
    ref={mapRef}
    maxH="500px"
    w="100%"
  >
    {showMap ? (
      <>
        {console.log("🗺 Rendering <MapBox> now...")}
        <MapBox locations={tour.locations} />
      </>
    ) : (
      <>
        {console.log("⌛ Map NOT rendered yet — waiting for intersection...")}
        <Box
          h="100%"
          w="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.400"
        >
          Loading map…
        </Box>
      </>
    )}
  </Box>
</Box>



            {/* REVIEWS */}
            <Box bg={cardBg} boxShadow="sm" borderRadius="lg" p={8}>
              <HStack justify="space-between" mb={4}>
                <HStack>
                  <Icon as={FiInfo} color="gray.700" boxSize={5} />
                  <Text fontWeight="bold" fontSize="lg">
                    Reviews ({reviews.length})
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiStar} color="yellow.400" boxSize={5} />
                  <Text fontSize="xl" fontWeight="bold">
                    {tour.ratingsAverage?.toFixed(1) || "4.9"}
                  </Text>
                  <Text color="gray.500">/ 5</Text>
                </HStack>
              </HStack>

              {reviews.length ? (
                reviews.map((r) => <ReviewCard key={r._id} review={r} />)
              ) : (
                <Text color="gray.500">No reviews yet for this tour.</Text>
              )}
            </Box>
          </GridItem>

          {/* BOOKING SIDEBAR */}
          <GridItem>
            <Box
              position="sticky"
              top="100px"
              bg={cardBg}
              borderRadius="lg"
              boxShadow="sm"
              p={8}
            >
              <Text fontSize="3xl" fontWeight="bold">
                ${tour.price}{" "}
                <Text
                  as="span"
                  fontWeight="medium"
                  color="gray.500"
                  fontSize="lg"
                >
                  / person
                </Text>
              </Text>

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
                      bg={isSelected ? "black" : "white"}
                      color={isSelected ? "white" : "gray.800"}
                      border="1px solid"
                      borderColor="gray.200"
                      justifyContent="space-between"
                      rightIcon={isSelected ? <Icon as={FiCheck} /> : null}
                      onClick={() => setSelectedDate(date)}
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
                <Badge colorScheme="red" px={2}>
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
</Button>;



              <VStack spacing={1} fontSize="sm" color="gray.500" mt={4}>
                <HStack>
                  <Icon as={FiCheck} />
                  <Text>Free cancellation up to 24 hours before</Text>
                </HStack>
                <HStack>
                  <Icon as={FiClock} />
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
