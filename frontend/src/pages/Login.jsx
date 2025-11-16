// src/pages/AuthPage.jsx
import {
  Box,
  Grid,
  GridItem,
  VStack,
  Heading,
  Flex,
  Text,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import {
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Md123, MdSms } from "react-icons/md";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Use FINAL hook
import { useToastMessage } from "../utils/toast";
import { useNavigate } from "react-router-dom"; // ✅ Correct redirect

export default function AuthPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const { login, signup, loading } = useAuth();
  const { showSuccess, showError } = useToastMessage();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [bgIndex, setBgIndex] = useState(1);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const toggleBg = (dir) => {
    setBgIndex((prev) => {
      const next = dir === "next" ? prev + 1 : prev - 1;
      if (next > 3) return 1;
      if (next < 1) return 3;
      return next;
    });
  };

  // -------------------------------------------------
  // LOGIN
  // -------------------------------------------------
  const handleLogin = async () => {
    try {
      const res = await login(email, password);

      const userName = res?.data?.user?.name || "Traveler";

      showSuccess("Login Successful!", `Welcome back, ${userName}`);

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      showError(
        "Login Failed",
        err?.response?.data?.message || "Invalid email or password."
      );
    }
  };
  // -------------------------------------------------
  // SIGNUP
  // -------------------------------------------------
  const handleSignup = async () => {
    try {
      const body = { name, email, password, passwordConfirm: password };

      const res = await signup(body); // ← matches FINAL store

      toast({
        position: "top",
        duration: 2500,
        isClosable: true,
        render: () => (
          <GlassAlert status="success" title="Welcome!">
            Account created successfully 🎉
          </GlassAlert>
        ),
      });

      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      toast({
        position: "top",
        duration: 3500,
        isClosable: true,
        render: () => (
          <GlassAlert status="error" title="Signup Failed">
            {err?.response?.data?.message || "Please try again."}
          </GlassAlert>
        ),
      });
    }
  };

  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      p={8}
      bgImage="url('/img/login_bg.png')"
      // bgSize="cover"
      // bg="linear-gradient( 359.5deg,  rgba(115,122,205,1) 8.8%, rgba(186,191,248,1) 77.4% );"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
    >
      <Grid
        templateColumns={["1fr", null, "1fr 1fr"]}
        h="70vh"
        w={["95%", "90%", "80%", "60%"]}
        bg="white"
        borderRadius="3xl"
        overflow="hidden"
        mt="5%"
        boxShadow="2xl"
      >
        {/* LEFT PANEL */}
        <GridItem
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={[6, 10]}
        >
          <VStack spacing={8} align="stretch" w="full" maxW="sm">
            <Box textAlign="center">
              <Heading fontFamily="Playfair Display" mb={2}>
                Travel Voyanix
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Explore More. Experience Life.
              </Text>
            </Box>

            {/* Toggle */}
            <HStack
              justify="center"
              bg={useColorModeValue("gray.100", "gray.700")}
              borderRadius="full"
              p={1.5}
            >
              <Button
                flex="1"
                borderRadius="full"
                color={isLogin ? "white" : "blackAlpha.500"}
                colorScheme={isLogin ? "purple" : "transparent"}
                boxShadow={isLogin ? "md" : "none"}
                onClick={() => setIsLogin(true)}
              >
                Login
              </Button>
              <Button
                flex="1"
                borderRadius="full"
                color={!isLogin ? "white" : "blackAlpha.500"}
                colorScheme={!isLogin ? "purple" : "transparent"}
                boxShadow={!isLogin ? "md" : "none"}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </Button>
            </HStack>

            {/* ------------------------------------------------- */}
            {/* LOGIN FORM */}
            {/* ------------------------------------------------- */}
            {isLogin ? (
              <VStack align="stretch" spacing={5}>
                <Heading size="md" textAlign="center">
                  Journey Begins
                </Heading>

                <HStack spacing={3} justify="center">
                  <Button leftIcon={<FcGoogle size={22} />} variant="outline">
                    Gmail
                  </Button>
                  <Button leftIcon={<Md123 size={22} />} variant="outline">
                    Email Code
                  </Button>
                  <Button leftIcon={<MdSms size={22} />} variant="outline">
                    SMS Code
                  </Button>
                </HStack>

                <HStack my={2}>
                  <Divider />
                  <Text fontSize="sm" color="gray.400">
                    or
                  </Text>
                  <Divider />
                </HStack>

                <Input
                  placeholder="Email address"
                  size="lg"
                  borderRadius="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <InputGroup size="lg">
                  <Input
                    placeholder="Password"
                    type={showPass ? "text" : "password"}
                    borderRadius="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={showPass ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowPass(!showPass)}
                    />
                  </InputRightElement>
                </InputGroup>

                <Button
                  colorScheme="purple"
                  size="lg"
                  borderRadius="lg"
                  isLoading={loading}
                  onClick={handleLogin}
                >
                  Log In
                </Button>
              </VStack>
            ) : (
              /* ------------------------------------------------- */
              /* SIGNUP FORM */
              /* ------------------------------------------------- */
              <VStack align="stretch" spacing={5}>
                <Heading size="md" textAlign="center">
                  Create Your Account
                </Heading>

                <Input
                  placeholder="Full Name"
                  size="lg"
                  borderRadius="lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  placeholder="Email address"
                  size="lg"
                  borderRadius="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <InputGroup size="lg">
                  <Input
                    placeholder="Password"
                    type={showPass ? "text" : "password"}
                    borderRadius="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={showPass ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowPass(!showPass)}
                    />
                  </InputRightElement>
                </InputGroup>

                <Button
                  colorScheme="purple"
                  size="lg"
                  borderRadius="lg"
                  isLoading={loading}
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </VStack>
            )}
          </VStack>
        </GridItem>

        {/* RIGHT PANEL */}
        <GridItem
          position="relative"
          overflow="hidden"
          bg={`url(/img/lbg-${bgIndex}.jpg) center/cover no-repeat`}
          clipPath="path('M0,0 h100% v100% q-30,0 -60,30 t-60,60 v-100% h-100% z')"
        >
          <Box
            position="absolute"
            top="6"
            right="20"
            transform="translateX(15%)"
          >
            <Box
              bg="whiteAlpha.900"
              p={6}
              borderRadius="2xl"
              shadow="xl"
              w="260px"
              position="relative"
            >
              <Heading fontSize="md" mb={2}>
                Wander, Explore, Experience.
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Discover new places, embrace adventures, & create memorable
                journeys.
              </Text>

              <Box
                position="absolute"
                top="18%"
                right="-15px"
                transform="translateY(-50%)"
                bg="white"
                borderRadius="full"
                p="3"
                shadow="lg"
              >
                <FiHeart color="red" />
              </Box>
            </Box>
          </Box>

          <Box
            position="absolute"
            bottom="10"
            right="10"
            color="white"
            textAlign="right"
          >
            <Heading fontSize="xl" mb={3}>
              Escape the Ordinary, <br /> Embrace the Journey
            </Heading>
            <Box
              bg="rgba(255,255,255,0.15)"
              borderRadius="xl"
              px={5}
              py={2}
              backdropFilter="blur(10px)"
              fontSize="sm"
            >
              Experience the world your way
            </Box>
          </Box>

          <HStack position="absolute" bottom="8" left="8" spacing={4}>
            <IconButton
              icon={<FiArrowLeft />}
              variant="ghost"
              color="white"
              onClick={() => toggleBg("prev")}
            />
            <IconButton
              icon={<FiArrowRight />}
              variant="ghost"
              color="white"
              onClick={() => toggleBg("next")}
            />
          </HStack>
        </GridItem>
      </Grid>
    </Flex>
  );
}
