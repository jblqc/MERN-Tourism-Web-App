// src/components/Filter.jsx
import {
  Box,
  SimpleGrid,
  Input,
  Select,
  Button,
  Tabs,
  TabList,
  Tab,
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

import { FiSearch } from "react-icons/fi";
import { MdFilterAltOff } from "react-icons/md";
import { DateRange } from "react-date-range";
import { useState } from "react";
import { useFilter } from "../hooks/useFilter";
import { useTour } from "../hooks/useTours";
import { useNavigate } from "react-router-dom";
import GlassBox from "./GlassBox";

export default function Filter({ mode = "home" }) {
  const {
    filters,
    setFilter,
    applyFilters,
    clearAllFilters
  } = useFilter();

  const { countries } = useTour();
  const navigate = useNavigate();

  const [openCalendar, setOpenCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const hasFilters = Object.values(filters).some((v) => v !== "");

  const content = (
    <>
      {/* DATE RANGE MODAL */}
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
                setFilter("dateFrom", range[0].startDate.toISOString().split("T")[0]);
                setFilter("dateTo", range[0].endDate.toISOString().split("T")[0]);
                setOpenCalendar(false);
              }}
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* FILTER BAR */}
      <SimpleGrid columns={[1, 5]} spacing={3}>
        {/* SEARCH */}
        <Input
          placeholder="Find a Destination"
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          color={mode === "home" ? "white" : "black"}
          borderColor={mode === "home" ? "whiteAlpha.500" : "gray.300"}
          _placeholder={{ color: mode === "home" ? "white" : "gray.500" }}
        />

        {/* PRICE RANGE */}
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
          color={mode === "home" ? "white" : "black"}
          borderColor={mode === "home" ? "whiteAlpha.500" : "gray.300"}
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
          color={mode === "home" ? "white" : "black"}
          borderColor={mode === "home" ? "whiteAlpha.500" : "gray.300"}
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        {/* DATE RANGE BUTTON */}
        <Button
          variant={mode === "home" ? "outline" : "solid"}
          borderColor={mode === "home" ? "whiteAlpha.500" : "gray.300"}
          color={mode === "home" ? "white" : "black"}
          onClick={() => setOpenCalendar(true)}
        >
          {filters.dateFrom && filters.dateTo
            ? `${filters.dateFrom} → ${filters.dateTo}`
            : "Select Date Range"}
        </Button>

        {/* APPLY BTN */}
        <Button
          colorScheme="purple"
          rightIcon={<FiSearch />}
          onClick={async () => {
            await applyFilters();
            if (mode === "home") navigate("/tours");
          }}
        >
          {mode === "home" ? "Discover" : "Apply"}
        </Button>
      </SimpleGrid>
    </>
  );

  // HOME VERSION (with Glass and Tabs)
  if (mode === "home") {
    return (
      <GlassBox>
        <Box>
          <Tabs variant="soft-rounded" colorScheme="purple" mb={4}>
            <Flex justify="space-between" align="center">
              <TabList justifyContent="center" flex="1">
                <Tab color="white">Destinations</Tab>
                <Tab color="white" onClick={() => navigate("/tours")}>
                  Tours
                </Tab>
                <Tab color="white">Packages</Tab>
              </TabList>

              <Icon
                as={MdFilterAltOff}
                boxSize={6}
                cursor="pointer"
                color={hasFilters ? "white" : "whiteAlpha.400"}
                onClick={() => hasFilters && clearAllFilters()}
                _hover={{
                  color: hasFilters ? "purple.300" : "whiteAlpha.400",
                }}
              />
            </Flex>
          </Tabs>
        </Box>

        {content}
      </GlassBox>
    );
  }

  // TOURS VERSION (simple clean bar)
  return (
    <Box>
      {content}
    </Box>
  );
}
