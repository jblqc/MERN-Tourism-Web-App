import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiHeart } from "react-icons/fi";
import { Md123, MdSms } from "react-icons/md";
import VerificationModal from "../components/VerificationModal";
import { useAuth } from "../hooks/useAuth";
import { useToastMessage } from "../utils/toast";
import { appConfig } from "../config/env";

const backgrounds = [1, 2, 3];

export default function AuthPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { login, signup, loading, googleLogin, initGoogleLoginButton, sendEmailCode, verifyEmailCode, sendSmsOtp, verifySmsOtp } = useAuth();
    const { showSuccess, showError } = useToastMessage();

    const mode = searchParams.get("mode");
    const [isLogin, setIsLogin] = useState(mode !== "signup");
    const [showPass, setShowPass] = useState(false);
    const [bgIndex, setBgIndex] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("email");
    const [modalValue, setModalValue] = useState("");
    const [modalCode, setModalCode] = useState("");
    const [modalLoading, setModalLoading] = useState(false);
    const [modalCodeSent, setModalCodeSent] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        setIsLogin(mode !== "signup");
    }, [mode]);

    useEffect(() => {
        if (!isLogin) return undefined;

        const timer = window.setTimeout(() => {
            initGoogleLoginButton(async (response) => {
                await googleLogin(response.credential);
                navigate("/");
            });
        }, 150);

        return () => window.clearTimeout(timer);
    }, [googleLogin, initGoogleLoginButton, isLogin, navigate]);

    const setAuthMode = (nextMode) => {
        const nextIsLogin = nextMode === "login";
        setIsLogin(nextIsLogin);
        setSearchParams(nextIsLogin ? {} : { mode: "signup" });
    };

    const resetVerificationModal = (nextMode) => {
        setModalMode(nextMode);
        setModalValue("");
        setModalCode("");
        setModalCodeSent(false);
        setModalOpen(true);
    };

    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            showSuccess("Login successful", `Welcome back, ${response?.user?.name || "Traveler"}`);
            setTimeout(() => navigate("/"), 900);
        } catch (err) {
            showError("Login failed", err.response?.data?.message || "Invalid credentials");
        }
    };

    const handleSignup = async () => {
        try {
            await signup({ name, email, password, passwordConfirm: password });
            showSuccess("Account created", "Welcome to Voyanix");
            setTimeout(() => navigate("/"), 900);
        } catch (err) {
            showError("Signup failed", err.response?.data?.message || "Please try again.");
        }
    };

    const handleSend = async () => {
        if (!modalValue) {
            showError(
                modalMode === "email" ? "Missing email" : "Missing phone number",
                `Please enter your ${modalMode === "email" ? "email" : "phone number"}.`,
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
            showSuccess("Code sent", "Please check your inbox or phone.");
        } catch (err) {
            showError("Send failed", err?.response?.data?.message || "Unable to send verification code.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!modalCode) {
            showError("Missing code", "Enter the 6-digit code.");
            return;
        }

        setModalLoading(true);

        try {
            if (modalMode === "email") {
                await verifyEmailCode(modalValue, modalCode);
            } else {
                await verifySmsOtp(modalValue, modalCode);
            }

            showSuccess("Login successful", "You are now signed in.");
            setModalOpen(false);
            navigate("/");
        } catch (err) {
            showError("Invalid code", err?.response?.data?.message || "Incorrect or expired verification code.");
        } finally {
            setModalLoading(false);
        }
    };

    const toggleBg = (direction) => {
        setBgIndex((current) => {
            if (direction === "next") {
                return (current + 1) % backgrounds.length;
            }

            return (current - 1 + backgrounds.length) % backgrounds.length;
        });
    };

    return (
        <Box
            minH="100dvh"
            bg="linear-gradient(180deg, #f4efe7 0%, #f7fbff 55%, #e8f1f5 100%)"
            px={{ base: 3, md: 5, lg: 8 }}
            py={{ base: 20, md: 24 }}
            overflowX="clip"
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

            <Box w="100%" maxW="1100px" mx="auto" display="flex" justifyContent="center">
                <Grid
                    templateColumns={{ base: "1fr", lg: "minmax(0, 480px) minmax(0, 1fr)" }}
                    w="100%"
                    bg="rgba(255,255,255,0.94)"
                    borderRadius={{ base: "28px", lg: "36px" }}
                    overflow="hidden"
                    boxShadow="0 30px 80px rgba(17, 24, 39, 0.12)"
                    border="1px solid rgba(255,255,255,0.65)"
                >
                    <GridItem px={{ base: 6, sm: 7, md: 8 }} py={{ base: 7, md: 9 }}>
                        <VStack align="stretch" spacing={6} minW={0}>
                            <Stack spacing={3}>
                                <Text fontSize="xs" fontWeight="700" letterSpacing="0.24em" textTransform="uppercase" color="#9a6b44">
                                    Travel made simple
                                </Text>
                                <Heading fontSize={{ base: "2xl", md: "4xl" }} lineHeight="1.05" color="#1f2937">
                                    Travel. Explore. Experience.
                                </Heading>
                            </Stack>

                            <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={2} bg="#f3efe8" p={1.5} borderRadius="full" alignItems="stretch">
                                <Button
                                    w="100%"
                                    h="46px"
                                    borderRadius="full"
                                    color={isLogin ? "white" : "gray.600"}
                                    bg={isLogin ? "#2f6f5e" : "transparent"}
                                    _hover={{ bg: isLogin ? "#255a4c" : "#e8e1d6" }}
                                    px={{ base: 3, md: 4 }}
                                    minW={0}
                                    justifyContent="center"
                                    onClick={() => setAuthMode("login")}
                                >
                                    Log In
                                </Button>
                                <Button
                                    w="100%"
                                    h="46px"
                                    borderRadius="full"
                                    color={!isLogin ? "white" : "gray.600"}
                                    bg={!isLogin ? "#2f6f5e" : "transparent"}
                                    _hover={{ bg: !isLogin ? "#255a4c" : "#e8e1d6" }}
                                    px={{ base: 3, md: 4 }}
                                    minW={0}
                                    justifyContent="center"
                                    onClick={() => setAuthMode("signup")}
                                >
                                    Sign Up
                                </Button>
                            </Grid>

                            {isLogin ? (
                                <VStack align="stretch" spacing={4}>
                                    <Heading size="md" color="#1f2937">
                                        Welcome back
                                    </Heading>

                                    {appConfig.googleClientId ? (
                                        <Box
                                            id="google-btn"
                                            minH="44px"
                                            w="100%"
                                            maxW="100%"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            borderRadius="xl"
                                            bg="white"
                                            px={2}
                                        />
                                    ) : (
                                        <Alert status="warning" borderRadius="xl" alignItems="flex-start">
                                            <AlertIcon mt={1} />
                                            <Text fontSize="sm">
                                                Google login is unavailable because `VITE_GOOGLE_CLIENT_ID` is missing from the deployed frontend environment.
                                            </Text>
                                        </Alert>
                                    )}

                                    <Button
                                        variant="outline"
                                        leftIcon={<Md123 />}
                                        h="48px"
                                        w="100%"
                                        borderRadius="xl"
                                        justifyContent="center"
                                        iconSpacing={3}
                                        onClick={() => resetVerificationModal("email")}
                                    >
                                        Send code to email
                                    </Button>

                                    <Button
                                        variant="outline"
                                        leftIcon={<MdSms />}
                                        h="48px"
                                        w="100%"
                                        borderRadius="xl"
                                        justifyContent="center"
                                        iconSpacing={3}
                                        onClick={() => resetVerificationModal("sms")}
                                    >
                                        Send code to SMS
                                    </Button>

                                    <HStack>
                                        <Divider />
                                        <Text fontSize="sm" color="gray.400" whiteSpace="nowrap">
                                            or use password
                                        </Text>
                                        <Divider />
                                    </HStack>

                                    <Input
                                        h="52px"
                                        borderRadius="xl"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        bg="white"
                                    />

                                    <InputGroup size="lg">
                                        <Input
                                            h="52px"
                                            borderRadius="xl"
                                            placeholder="Password"
                                            type={showPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            bg="white"
                                        />
                                        <InputRightElement h="52px">
                                            <IconButton
                                                aria-label={showPass ? "Hide password" : "Show password"}
                                                variant="ghost"
                                                icon={showPass ? <FiEyeOff /> : <FiEye />}
                                                onClick={() => setShowPass((current) => !current)}
                                            />
                                        </InputRightElement>
                                    </InputGroup>

                                    <Button
                                        h="52px"
                                        w="100%"
                                        borderRadius="xl"
                                        bg="#2f6f5e"
                                        color="white"
                                        _hover={{ bg: "#255a4c" }}
                                        isLoading={loading}
                                        onClick={handleLogin}
                                    >
                                        Log In
                                    </Button>
                                </VStack>
                            ) : (
                                <VStack align="stretch" spacing={4}>
                                    <Heading size="md" color="#1f2937">
                                        Create your account
                                    </Heading>

                                    <Input
                                        h="52px"
                                        borderRadius="xl"
                                        placeholder="Full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        bg="white"
                                    />

                                    <Input
                                        h="52px"
                                        borderRadius="xl"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        bg="white"
                                    />

                                    <InputGroup size="lg">
                                        <Input
                                            h="52px"
                                            borderRadius="xl"
                                            placeholder="Password"
                                            type={showPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            bg="white"
                                        />
                                        <InputRightElement h="52px">
                                            <IconButton
                                                aria-label={showPass ? "Hide password" : "Show password"}
                                                variant="ghost"
                                                icon={showPass ? <FiEyeOff /> : <FiEye />}
                                                onClick={() => setShowPass((current) => !current)}
                                            />
                                        </InputRightElement>
                                    </InputGroup>

                                    <Button
                                        h="52px"
                                        w="100%"
                                        borderRadius="xl"
                                        bg="#9a6b44"
                                        color="white"
                                        _hover={{ bg: "#7f5736" }}
                                        isLoading={loading}
                                        onClick={handleSignup}
                                    >
                                        Sign Up
                                    </Button>
                                </VStack>
                            )}
                        </VStack>
                    </GridItem>

                    <GridItem
                        display={{ base: "none", lg: "block" }}
                        position="relative"
                        minH="720px"
                        bgImage={`linear-gradient(180deg, rgba(16,24,40,0.18), rgba(16,24,40,0.62)), url(/img/lbg-${backgrounds[bgIndex]}.jpg)`}
                        bgSize="cover"
                        bgPos="center"
                    >
                        <Flex direction="column" justify="space-between" h="100%" p={8} color="white">
                            <Box maxW="300px" ml="auto">
                                <Box
                                    bg="rgba(255,255,255,0.14)"
                                    border="1px solid rgba(255,255,255,0.18)"
                                    backdropFilter="blur(14px)"
                                    borderRadius="28px"
                                    p={6}
                                    position="relative"
                                >
                                    <Heading fontSize="lg" mb={3}>
                                        Wander with a little more confidence.
                                    </Heading>
                                    <Text fontSize="sm" color="whiteAlpha.900">
                                        Cleaner sign in, lighter page loads, and a layout that finally behaves on mobile.
                                    </Text>
                                    <Box
                                        position="absolute"
                                        top="-12px"
                                        right="-12px"
                                        w="44px"
                                        h="44px"
                                        borderRadius="full"
                                        bg="white"
                                        color="#d9485f"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <FiHeart />
                                    </Box>
                                </Box>
                            </Box>

                            <VStack align="stretch" spacing={5}>
                                <Box>
                                    <Text fontSize="xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase" color="whiteAlpha.800">
                                        Escape the ordinary
                                    </Text>
                                    <Heading fontSize="4xl" lineHeight="1.05" mt={3}>
                                        Plan less. Enjoy the journey more.
                                    </Heading>
                                </Box>

                                <HStack justify="space-between">
                                    <Text maxW="340px" color="whiteAlpha.900">
                                        Smooth booking flows start with a page that loads fast and stays readable on small screens.
                                    </Text>

                                    <HStack spacing={3}>
                                        <IconButton
                                            aria-label="Previous background"
                                            icon={<FiArrowLeft />}
                                            variant="ghost"
                                            color="white"
                                            _hover={{ bg: "whiteAlpha.200" }}
                                            onClick={() => toggleBg("prev")}
                                        />
                                        <IconButton
                                            aria-label="Next background"
                                            icon={<FiArrowRight />}
                                            variant="ghost"
                                            color="white"
                                            _hover={{ bg: "whiteAlpha.200" }}
                                            onClick={() => toggleBg("next")}
                                        />
                                    </HStack>
                                </HStack>
                            </VStack>
                        </Flex>
                    </GridItem>
                </Grid>
            </Box>
        </Box>
    );
}
