import {
  Box,
  Image,
  Heading,
  Text,
  Stack,
  Flex,
  Icon,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCalendar, FiFlag, FiUsers, FiStar } from "react-icons/fi";
import { useTourStore } from "../store/useTourStore";
import defaultImg from "../assets/default.jpg";
import { FcGlobe } from "react-icons/fc";

export default function TourCard({ tour }) {
  const navigate = useNavigate();
  const setCurrentTour = useTourStore((state) => state.setCurrentTour);

  // SAFE IMAGE SELECTION
  const imgSrc =
    tour.imageCover?.startsWith("http") || tour.cover?.startsWith("http")
      ? tour.imageCover || tour.cover
      : tour.imageCover
      ? `/img/tours/${tour.imageCover}`
      : tour.cover
      ? `/img/tours/${tour.cover}`
      : defaultImg;

  const rating = tour.ratingsAverage ?? tour.rating ?? 4.5; // fallback rating

  const handleClick = () => {
    setCurrentTour(tour);
    navigate(`/tour/${tour.slug}`);
  };

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
    >
      {/* IMAGE */}
      <Box
        position="relative"
        h="240px"
        overflow="hidden"
        onClick={handleClick}
        cursor="pointer"
      >
        <Image
          src={imgSrc}
          alt={tour.name}
          w="100%"
          fallbackSrc={defaultImg}
          h="100%"
          objectFit="cover"
          transition="0.4s"
          _hover={{ transform: "scale(1.05)" }}
        />

        {/* TOUR TITLE */}
        <Heading
          position="absolute"
          bottom="4"
          left="4"
          color="white"
          size="md"
          zIndex="2"
          textShadow="0px 2px 4px rgba(0,0,0,0.6)"
        >
          {tour.name}
        </Heading>

        {/* COUNTRY CHIP */}
        {tour?.country && (
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
            <Icon as={FcGlobe} boxSize={4} />
            <Text fontWeight="bold" fontSize="sm">
              {tour.country}
            </Text>
          </Box>
        )}
      </Box>

      {/* CONTENT */}
      <Box p={5}>
        {/* DIFFICULTY + DAYS */}
        {tour?.difficulty && (
          <Text fontSize="sm" color="gray.500" mb={2}>
            {tour.difficulty} • {tour.duration || "Multi"} days
          </Text>
        )}

        {/* SUMMARY */}
        <Text noOfLines={2} fontSize="sm" color="gray.700" mb={4}>
          {tour.summary || "Amazing travel experience awaits!"}
        </Text>

        <Stack spacing={2} fontSize="sm" color="gray.600">
          {/* START LOCATION */}
          {tour.startLocation?.description && (
            <Flex align="center" gap={2}>
              <Icon as={FiMapPin} color="purple.500" />
              <Text>{tour.startLocation.description}</Text>
            </Flex>
          )}

          {/* DATE SAFE FALLBACK */}
          {tour.startDates?.length > 0 && (
            <Flex align="center" gap={2}>
              <Icon as={FiCalendar} color="purple.500" />
              <Text>
                {new Date(tour.startDates[0]).toLocaleString("en-us", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </Flex>
          )}

          {/* STOPS */}
          {tour.locations?.length > 0 && (
            <Flex align="center" gap={2}>
              <Icon as={FiFlag} color="Purple.500" />
              <Text>{tour.locations.length} stops</Text>
            </Flex>
          )}

          {/* PEOPLE */}
          {tour.maxGroupSize && (
            <Flex align="center" gap={2}>
              <Icon as={FiUsers} color="purple.500" />
              <Text>{tour.maxGroupSize} people</Text>
            </Flex>
          )}
        </Stack>
      </Box>

      {/* FOOTER */}
      <Flex justify="space-between" align="center" p={5} bg="purple.50">
        <Box>
          {/* PRICE */}
          {tour.price && (
            <Text fontWeight="bold" fontSize="lg" color="purple.600">
              ${tour.price}
              <Text as="span" color="gray.500" fontSize="sm">
                {" "}
                per person
              </Text>
            </Text>
          )}

          {/* SAFE RATING */}
          <Flex align="center" mt={1} gap={1} color="yellow.500">
            <Icon as={FiStar} />
            <Text fontWeight="medium" color="gray.700">
              {rating.toFixed(1)}
            </Text>
          </Flex>
        </Box>

        <Button onClick={handleClick} colorScheme="purple" size="sm">
          Details
        </Button>
      </Flex>
    </Box>
  );
}
