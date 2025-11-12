import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  Avatar,
  HStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth?.() || { user: null, logout: null };

  return (
    <Box bg="teal.500" px={8} py={4} color="white" boxShadow="md" position="sticky" top="0" zIndex="10">
      <Flex align="center">
        {/* Left nav */}
        <HStack spacing={6}>
          <ChakraLink as={Link} to="/" fontWeight="medium" _hover={{ textDecoration: 'none', color: 'teal.100' }}>
            All Tours
          </ChakraLink>
        </HStack>

        <Spacer />

        {/* Center logo */}
        <Link to="/">
          <Heading size="md" letterSpacing="wide">
            <img
              src="/img/logo-white.png"
              alt="Natours logo"
              style={{ height: '35px', margin: 'auto' }}
            />
          </Heading>
        </Link>

        <Spacer />

        {/* Right nav */}
        <HStack spacing={4}>
          {user ? (
            <>
              <Button
                variant="outline"
                colorScheme="whiteAlpha"
                size="sm"
                onClick={logout}
              >
                Log out
              </Button>
              <Link to="/me">
                <Flex align="center" gap={2}>
                  <Avatar
                    size="sm"
                    name={user.name}
                    src={`/img/users/${user.photo}`}
                    border="2px solid white"
                  />
                  <Box>{user.name.split(' ')[0]}</Box>
                </Flex>
              </Link>
            </>
          ) : (
            <>
              <Button
                as={Link}
                to="/login"
                size="sm"
                colorScheme="whiteAlpha"
                variant="outline"
              >
                Log in
              </Button>
              <Button
                as={Link}
                to="/signup"
                size="sm"
                colorScheme="teal"
                bg="white"
                color="teal.500"
                _hover={{ bg: 'teal.100' }}
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
