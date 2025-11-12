import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Flex,
  FormErrorMessage,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState } from 'react';
import { login } from '../api/authApi';
import Alert from '../components/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  // ✅ Simple validation logic
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail || !isValidPassword) {
      toast({
        title: 'Invalid input',
        description:
          !isValidEmail
            ? 'Please enter a valid email address.'
            : 'Password must be at least 8 characters long.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setAlert({ type: 'success', message: 'Logged in successfully!' });
      toast({
        title: 'Welcome back!',
        description: 'Redirecting to home...',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => (window.location = '/'), 1200);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Login failed',
      });
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const cardBg = useColorModeValue('whiteAlpha.900', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, teal.500, green.400)"
      px={4}
    >
      <Container
        maxW="md"
        bg={cardBg}
        boxShadow="2xl"
        borderRadius="2xl"
        p={10}
        backdropFilter="blur(8px)"
      >
        <VStack as="form" spacing={6} onSubmit={handleSubmit}>
          <Heading size="lg" textAlign="center" color="teal.600">
            Log into your account
          </Heading>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Enter your credentials to access your dashboard
          </Text>

          {/* EMAIL */}
          <FormControl id="email" isRequired isInvalid={email && !isValidEmail}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              bg={inputBg}
              size="lg"
              borderRadius="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderColor={email && !isValidEmail ? 'red.400' : 'gray.200'}
              _focus={{
                borderColor: isValidEmail ? 'teal.400' : 'red.400',
                boxShadow: '0 0 0 1px teal.300',
              }}
            />
            {!isValidEmail && email && (
              <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
            )}
          </FormControl>

          {/* PASSWORD */}
          <FormControl
            id="password"
            isRequired
            isInvalid={password && !isValidPassword}
          >
            <FormLabel>Password</FormLabel>
            <InputGroup size="lg">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                bg={inputBg}
                borderRadius="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                borderColor={password && !isValidPassword ? 'red.400' : 'gray.200'}
                _focus={{
                  borderColor: isValidPassword ? 'teal.400' : 'red.400',
                  boxShadow: '0 0 0 1px teal.300',
                }}
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Show password"
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </InputRightElement>
            </InputGroup>
            {!isValidPassword && password && (
              <FormErrorMessage>
                Password must be at least 8 characters.
              </FormErrorMessage>
            )}
          </FormControl>

          {/* SUBMIT */}
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            isLoading={loading}
            loadingText="Logging in..."
            borderRadius="lg"
          >
            Login
          </Button>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
        </VStack>
      </Container>
    </Flex>
  );
}
