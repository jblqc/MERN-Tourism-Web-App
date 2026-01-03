import { Spinner, Flex, Text } from "@chakra-ui/react";

export default function FullPageLoader() {
  return (
    <Flex
      h="100vh"
      w="100vw"
      align="center"
      justify="center"
      direction="column"
      bg="white"
    >
      <Spinner size="xl" thickness="4px" speed="0.65s" color="purple.500" />
      <Text mt={4} fontSize="lg" color="gray.600">
        Loading...
      </Text>
    </Flex>
  );
}
