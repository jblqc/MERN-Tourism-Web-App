// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { getAllTours } from '../api/tourApi';
import { SimpleGrid, Container, Spinner, Text } from '@chakra-ui/react';
import TourCard from '../components/TourCard';

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTours().then(setTours).finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Container textAlign="center" py={10}>
        <Spinner size="xl" color="teal" />
      </Container>
    );

  if (!tours.length)
    return (
      <Container textAlign="center" py={10}>
        <Text>No tours available.</Text>
      </Container>
    );

  return (
    <Container maxW="6xl" py={10}>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {tours.map((tour) => (
          <TourCard key={tour._id} tour={tour} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
