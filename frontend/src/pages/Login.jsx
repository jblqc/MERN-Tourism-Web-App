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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import {
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiArrowRight,
  FiHeart,
} from "react-icons/fi";
import { Md123, MdSms } from "react-icons/md";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToastMessage } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import VerificationModal from "../components/VerificationModal";
export default function AuthPage() {
  const navigate = useNavigate();
  const {
    login,
    signup,
    loading,
    googleLogin,
    initGoogleLoginButton,
    sendEmailCode,
    verifyEmailCode,
    sendSmsOtp,
    verifySmsOtp,
  } = useAuth();

  const { showSuccess, showError } = useToastMessage();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [bgIndex, setBgIndex] = useState(1);

  // Unified modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("email"); // 'email' | 'sms'
  const [modalValue, setModalValue] = useState("");
  const [modalCode, setModalCode] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalCodeSent, setModalCodeSent] = useState(false);

  // Login & Signup fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  /* ----------------------------------------------
     GOOGLE LOGIN BUTTON INIT
  ------------------------------------------------*/
  useEffect(() => {
    if (!isLogin) return;

    initGoogleLoginButton(async (res) => {
      await googleLogin(res.credential);
      navigate("/");
    });
  }, [isLogin]);

  /* ----------------------------------------------
     LOGIN (email + password)
  ------------------------------------------------*/
  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      showSuccess(
        "Login Successful!",
        `Welcome back, ${res?.data?.user?.name || "Traveler"}`
      );
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      showError(
        "Login Failed",
        err.response?.data?.message || "Invalid credentials"
      );
    }
  };

  /* ----------------------------------------------
     OTP MODAL HELPERS
  ------------------------------------------------*/
  const openEmailModal = () => {
    setModalMode("email");
    setModalValue("");
    setModalCode("");
    setModalCodeSent(false);
    setModalOpen(true);
  };

  const openSmsModal = () => {
    setModalMode("sms");
    setModalValue("");
    setModalCode("");
    setModalCodeSent(false);
    setModalOpen(true);
  };

  const handleSend = async () => {
    if (!modalValue) {
      showError(
        modalMode === "email" ? "Missing Email" : "Missing Phone Number",
        `Please enter your ${modalMode === "email" ? "email" : "phone number"}.`
      );
      return;
    }

    setModalLoading(true);

    try {
      if (modalMode === "email") {
        await sendEmailCode(modalValue);
      } else {
        await sendSmsOtp(modalValue);
      }

      setModalCodeSent(true);
      showSuccess("Code Sent!", "Please check your inbox or phone.");
    } catch (err) {
      showError(
        "Failed",
        err?.response?.data?.message || "Unable to send verification code."
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!modalCode) {
      showError("Missing Code", "Enter the 6-digit code.");
      return;
    }

    setModalLoading(true);

    try {
      let res;

      if (modalMode === "email") {
        res = await verifyEmailCode(modalValue, modalCode);
      } else {
        res = await verifySmsOtp(modalValue, modalCode);
      }

      showSuccess(
        "Login Successful",
        `Welcome back ${res?.data?.user?.name || "Traveler"}`
      );

      setModalOpen(false);
      navigate("/");
    } catch (err) {
      showError(
        "Invalid Code",
        err?.response?.data?.message ||
          "Incorrect or expired verification code."
      );
    } finally {
      setModalLoading(false);
    }
  };

  /* ----------------------------------------------
     SIGNUP
  ------------------------------------------------*/
  const handleSignup = async () => {
    try {
      const body = { name, email, password, passwordConfirm: password };
      await signup(body);

      showSuccess("Account created!", "Welcome to Voyanix 🌍");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      showError(
        "Signup Failed",
        err.response?.data?.message || "Please try again."
      );
    }
  };

  /* ----------------------------------------------
     BACKGROUND SLIDER
  ------------------------------------------------*/
  const toggleBg = (dir) => {
    setBgIndex((prev) => {
      const next = dir === "next" ? prev + 1 : prev - 1;
      if (next > 3) return 1;
      if (next < 1) return 3;
      return next;
    });
  };

  return (
    <Flex
      align="center"
      justify="center"
      p={8}
      bgImage="url('/img/login_bg.png')"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
    >
      <VerificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        value={modalValue}
        setValue={setModalValue}
        code={modalCode}
        setCode={setModalCode}
        loading={modalLoading}
        isCodeSent={modalCodeSent}
        onSend={handleSend}
        onVerify={handleVerify}
      />

      <Grid
        templateColumns={["1fr", null, "1fr 1fr"]}
        h="100vh"
        w={["95%", "90%", "80%", "70%"]}
        bg="white"
        borderRadius="3xl"
        overflow="hidden"
        my="4%"
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

            {/* LOGIN FORM */}
            {isLogin ? (
              <VStack align="stretch">
                <Heading size="md" textAlign="center">
                  Journey Begins
                </Heading>
                <Box w="100%">
                  <div id="google-btn"></div>
                </Box>

                <Button
                  colorScheme="gray"
                  variant="outline"
                  leftIcon={<Md123 />}
                  onClick={openEmailModal}
                >
                  Send code to Email
                </Button>

                <Button
                  colorScheme="gray"
                  variant="outline"
                  leftIcon={<MdSms />}
                  onClick={openSmsModal}
                >
                  Send code to SMS
                </Button>

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
              /* SIGNUP FORM */
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
