import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  HStack,
  VStack,
  Badge,
  Button,
  Tag,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  Grid,
  GridItem,
  useDisclosure,
} from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";

import PageTransition from "../components/PageTransition";
import Filter from "../components/Filter";
import defaultImg from "../assets/default.jpg";

import { usePackageStore } from "../store/usePackageStore";
import { useTour } from "../hooks/useTours";

/* ==========================================================================
   PACKAGES PAGE — backend-driven, keeping your old UI
   ========================================================================== */

export default function Packages() {
  const { packages, fetchPackages, loading } = usePackageStore();
  const { countries, fetchCountries } = useTour();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    fetchPackages();
    fetchCountries();
  }, []);

  const openPackage = (pkg) => {
    setSelectedPkg(pkg);
    onOpen();
  };

  /* ------------------------------
   * SEARCH + COUNTRY FILTER
   * ------------------------------ */
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      if (countryFilter && p.country !== countryFilter) return false;

      if (search) {
        const s = search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(s) &&
          !p.description.toLowerCase().includes(s)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [packages, search, countryFilter]);

  /* ------------------------------
   * FEATURED + REGULAR SEPARATION
   * ------------------------------ */
  const featured = filteredPackages.filter((p) => p.isFeatured);
  const regular = filteredPackages.filter((p) => !p.isFeatured);

  return (
    <PageTransition>
      <Box>
        {/* ============================================================
            HERO SECTION
        ============================================================ */}
        <Box
          bgImage="url(/img/package-bg.png)"
          bgSize="cover"
          py={[20, 28]}
          color="white"
          position="relative"
        >
          <Container maxW="7xl" position="relative" zIndex={2} marginTop={70}>
            <VStack align="flex-start" spacing={4} maxW="3xl">
              <Heading fontSize={["3xl", "5xl"]} lineHeight="1.05">
                Bundled adventures — curated packages
              </Heading>

              <Text fontSize="lg" maxW="xl">
                Save more with thoughtfully combined tours. All bundles are
                generated directly from our best-rated experiences.
              </Text>

             
            </VStack>
          </Container>

          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-b, rgba(0, 0, 0, 0.03), rgba(19, 3, 18, 0.38))"
          />
        </Box>

        {/* ============================================================
            FILTERS
        ============================================================ */}
        <Container maxW="7xl" py={12}>
          <Box mb={8}>
            <Filter mode="tours" />
          </Box>

          {/* SMALL FILTERS */}
          <HStack spacing={4} mb={6}>
            <Tag>All Packages</Tag>
            <Tag>Featured</Tag>
            <Tag>Budget</Tag>
            <Tag>Adventure</Tag>

            <Box ml="auto" display="flex" gap={2}>
              <InputLikeSearch setSearch={setSearch} />
              <CountryFilter countries={countries} setCountryFilter={setCountryFilter} />
            </Box>
          </HStack>

          {/* ============================================================
              FEATURED PACKAGES
          ============================================================ */}
          {featured.length > 0 && (
            <>
              <Heading size="md" mb={4}>
                Featured Bundles
              </Heading>

              <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={12}>
                {featured.map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} onOpen={() => openPackage(pkg)} />
                ))}
              </SimpleGrid>

              <Divider mb={10} />
            </>
          )}

          {/* ============================================================
              ALL PACKAGES
          ============================================================ */}
          <Heading size="md" mb={4}>
            All Packages
          </Heading>

          {loading ? (
            <Text>Loading packages...</Text>
          ) : regular.length === 0 ? (
            <Text>No packages match your filters.</Text>
          ) : (
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {regular.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} onOpen={() => openPackage(pkg)} />
              ))}
            </SimpleGrid>
          )}
        </Container>

        {/* ============================================================
            PACKAGE MODAL
        ============================================================ */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedPkg?.title}</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              {selectedPkg && (
                <Grid templateColumns={["1fr", "1fr 2fr"]} gap={6}>
                  <GridItem>
                    <Image
                      src={selectedPkg.imageCover || defaultImg}
                      borderRadius="md"
                      w="100%"
                      h="220px"
                      objectFit="cover"
                    />

                    <HStack mt={3} spacing={3}>
                      <Badge colorScheme="purple">{selectedPkg.country}</Badge>
                      <HStack spacing={1}>
                        <Icon as={FiStar} />
                        <Text>{selectedPkg.ratingAverage?.toFixed(1)}</Text>
                      </HStack>
                      {selectedPkg.tags?.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </HStack>
                  </GridItem>

                  <GridItem>
                    <VStack align="flex-start" spacing={3}>
                      <Text>{selectedPkg.description}</Text>

                      <Box>
                        <Heading size="sm">Included Tours</Heading>

                        <VStack align="stretch" mt={2} spacing={2}>
                          {(selectedPkg.includedTours || []).map((t) => (
                            <Box
                              key={t._id}
                              p={3}
                              borderWidth={1}
                              borderRadius="md"
                            >
                              <HStack justify="space-between">
                                <Text fontWeight="semibold">{t.name}</Text>

                                <Text>${t.price?.toLocaleString()}</Text>
                              </HStack>

                              <Text fontSize="sm" color="gray.500">
                                {t.summary}
                              </Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>

                      <Divider />

                      <HStack justify="space-between" w="100%">
                        <Text fontWeight="bold">Total Price</Text>
                        <Text fontSize="xl" fontWeight="extrabold">
                          ${selectedPkg.totalPrice?.toLocaleString()}
                        </Text>
                      </HStack>

                      <HStack justify="space-between" w="100%">
                        <Text fontWeight="bold">Total Days</Text>
                        <Text>{selectedPkg.totalDays} days</Text>
                      </HStack>
                    </VStack>
                  </GridItem>
                </Grid>
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="purple" mr={3}>
                Book Package
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </PageTransition>
  );
}

/* ==========================================================================
   Helper Components
   ========================================================================== */

function PackageCard({ pkg, onOpen }) {
  return (
    <Box
      borderWidth={1}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      _hover={{ transform: "translateY(-6px)", transition: "0.25s" }}
    >
      <Image
        src={pkg.imageCover || defaultImg}
        w="100%"
        h="220px"
        objectFit="cover"
      />

      <Box p={4}>
        <HStack justify="space-between" mb={2}>
          <Heading size="sm">{pkg.title}</Heading>

          <HStack>
            <Icon as={FiStar} />
            <Text fontWeight="semibold">
              {pkg.ratingAverage?.toFixed(1)}
            </Text>
          </HStack>
        </HStack>

        <Text color="gray.600" noOfLines={2} mb={3}>
          {pkg.description}
        </Text>

        <HStack justify="space-between" align="end">
          <VStack align="flex-start">
            <Text fontSize="sm">
              Includes {pkg.includedTours?.length || 0} tours
            </Text>
            <Text fontWeight="bold">{pkg.totalDays} days</Text>
          </VStack>

          <VStack align="flex-end">
            <Text fontSize="sm" color="gray.500">
              Starting from
            </Text>
            <Text fontSize="lg" fontWeight="extrabold">
              ${pkg.totalPrice?.toLocaleString()}
            </Text>

            <Button size="sm" colorScheme="purple" onClick={onOpen}>
              View
            </Button>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}

function InputLikeSearch({ setSearch }) {
  return (
    <Box>
      <input
        placeholder="Search packages..."
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #E2E8F0",
        }}
      />
    </Box>
  );
}

function CountryFilter({ countries = [], setCountryFilter }) {
  return (
    <select
      onChange={(e) => setCountryFilter(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid #E2E8F0",
      }}
    >
      <option value="">All countries</option>

      {countries.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
}
