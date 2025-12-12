import { Box, Flex, Text, HStack, Icon, Link } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import GlassBox from "./GlassBox";
export default function Footer() {
  return (
    <GlassBox w="100%" py={8}>
      <Flex
        direction={["column", "row"]}
        justify="space-between"
        align="center"
        maxW="6xl"
        mx="auto"
        px={4}
      >
        {/* Brand / Copy */}
        <Text color="gray.600" fontSize="sm">
          © {new Date().getFullYear()} Travel. All rights reserved.
        </Text>

        {/* Social icons */}
        <HStack spacing={4} mt={[4, 0]}>
          <Link href="#" isExternal>
            <Icon
              as={FaFacebook}
              w={5}
              h={5}
              color="purple.500"
              _hover={{ color: "purple.600" }}
            />
          </Link>
          <Link href="#" isExternal>
            <Icon
              as={FaInstagram}
              w={5}
              h={5}
              color="purple.500"
              _hover={{ color: "purple.600" }}
            />
          </Link>
          <Link href="#" isExternal>
            <Icon
              as={FaTwitter}
              w={5}
              h={5}
              color="purple.500"
              _hover={{ color: "purple.600" }}
            />
          </Link>
        </HStack>
      </Flex>
    </GlassBox>
  );
}
