// src/components/Header.jsx
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  Avatar,
  HStack,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

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
      px={8}
      py={1}
      top="0"
      left="0"
      w="100%"
      zIndex="1000"
      transition="0.3s ease"
      bg={scrolled ? "rgba(254, 255, 254, 0.63)" : "white"}
      backdropFilter={scrolled ? "blur(10px)" : "none"}
      boxShadow={scrolled ? "md" : "none"}
    >
      <Flex align="center">
        {/* LEFT NAV */}
        <HStack spacing={2}>
          <ChakraLink
            as={Link}
            to="/"
            fontWeight="medium"
            _hover={{ textDecoration: "none", color: "blue.300" }}
          >
            Travel
          </ChakraLink>
        </HStack>

        <Spacer />

        {/* CENTER LOGO */}
        <Link to="/">
            <img
              src="/img/logo_h.png"
              alt="Travel logo"
              style={{ height: "60px" , padding:"0"}}
              
            />
        </Link>

        <Spacer />

        {/* RIGHT NAV */}
        <HStack spacing={4}>
          {isLoggedIn ? (
            <>
              {/* LOGOUT BUTTON */}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>

              {/* PROFILE LINK */}
              <Link to="/me">
                <Flex align="center" gap={2} cursor="pointer">
                  <Avatar
                    size="sm"
                    name={user?.name}
                    src={
                      user?.photo?.startsWith("http")
                        ? user.photo
                        : `${import.meta.env.VITE_BACKEND_URL}/img/users/${
                            user.photo
                          }`
                    }
                    border="2px solid white"
                  />
                  <Text fontWeight="medium">{user?.name?.split(" ")[0]}</Text>
                </Flex>
              </Link>
            </>
          ) : (
            <>
              <Button
                as={Link}
                to="/login"
                size="sm"
                bg={scrolled ? "rgba(254, 255, 254, 0.32)" : "white"}
              >
                Log in
              </Button>

              <Button
                as={Link}
                to="/signup"
                size="sm"
                bg={scrolled ? "rgba(254, 255, 254, 0.32)" : "white"}
              >
                Sign up
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}
