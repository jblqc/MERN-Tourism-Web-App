// src/components/Header.jsx
import {
  Box,
  Flex,
  Button,
  Avatar,
  HStack,
  Link as ChakraLink,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { buildAssetUrl } from "../config/env";

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Clear store + backend cookie
    navigate("/"); // Redirect home
  };
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // change threshold here
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      position="fixed"
      px={{ base: 3, md: 6, lg: 8 }}
      py={2}
      top="0"
      left="0"
      w="100%"
      zIndex="1000"
      transition="0.3s ease"
      bg={scrolled ? "rgba(254, 255, 254, 0.63)" : "white"}
      backdropFilter={scrolled ? "blur(10px)" : "none"}
      boxShadow={scrolled ? "md" : "none"}
    >
      <Grid
        templateColumns="minmax(0, 1fr) auto minmax(0, 1fr)"
        alignItems="center"
        gap={{ base: 2, md: 4 }}
      >
        <GridItem minW={0}>
          <ChakraLink
            as={Link}
            to="/"
            fontWeight="medium"
            fontSize={{ base: "md", md: "lg" }}
            _hover={{ textDecoration: "none", color: "blue.300" }}
          >
            Travel
          </ChakraLink>
        </GridItem>

        <GridItem justifySelf="center">
          <Link to="/">
            <img
              src="/img/logo_h.png"
              alt="Travel logo"
              style={{ height: "44px", padding: "0", display: "block" }}
            />
          </Link>
        </GridItem>

        <GridItem minW={0} justifySelf="end">
        <HStack
          spacing={{ base: 2, md: 3 }}
          justify="flex-end"
          flexWrap="wrap"
        >
          {isLoggedIn && user ? (
  <>
    <Button variant="ghost" size={{ base: "xs", md: "sm" }} onClick={handleLogout}>
      Log out
    </Button>

    <Link to="/me?tab=profile">
      <Flex align="center" gap={2} cursor="pointer" minW={0}>
        <Avatar
          size="sm"
          name={user.name}
          src={
            user.photo?.startsWith("http")
              ? user.photo
              : buildAssetUrl(`/img/users/${user.photo}`)
          }
          border="2px solid white"
        />
        <Text display={{ base: "none", md: "block" }} fontWeight="medium">
          {user.name?.split(" ")[0]}
        </Text>
      </Flex>
    </Link>
  </>
) : (
  <>
    <Button
      as={Link}
      to="/login"
      size={{ base: "xs", md: "sm" }}
      minW={{ base: "76px", md: "88px" }}
    >
      Log in
    </Button>
    <Button
      as={Link}
      to="/login?mode=signup"
      size={{ base: "xs", md: "sm" }}
      minW={{ base: "76px", md: "88px" }}
    >
      Sign up
    </Button>
  </>
)}
        </HStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
