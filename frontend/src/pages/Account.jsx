import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Grid,
  GridItem,
  Avatar,
  VStack,
  HStack,
  Container,
  Heading,
  Text,
  Input,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Flex,
  Icon,
  useColorModeValue,
  chakra,
} from "@chakra-ui/react";
import { FiUser, FiLock, FiSettings } from "react-icons/fi";
import { useToastMessage } from "../utils/toast";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Account() {
  const { user, updateProfile, updatePassword } = useAuth();
  const { showSuccess, showError } = useToastMessage();

  if (!user) return <Text textAlign="center">Loading user…</Text>;

  // Colors
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.6)",
    "rgba(50,50,70,0.3)"
  );
  const cardBorder = useColorModeValue("whiteAlpha.700", "whiteAlpha.300");

  const glass = {
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "22px",
    border: `1px solid ${cardBorder}`,
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.15)",
  };

  // Update profile
  const handleUserData = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      await updateProfile(form);
      showSuccess("Profile updated");
    } catch {
      showError("Error updating profile");
    }
  };

  // Update password
  const handlePassword = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = Object.fromEntries(data);

    try {
      await updatePassword(payload);
      showSuccess("Password changed");
      e.target.reset();
    } catch {
      showError("Error updating password");
    }
  };

  return (
    <Box
      minH="100vh"
      px={4}
      pt="110px"
      pb={20}
      bg="#F6F1FF" // 💜 subtle modern lilac (not a gradient)
      position="relative"
      overflow="hidden"
    >
      {/* ❇️ Ambient floating shapes (visionOS style) */}
      <AmbientBlob top="-150px" left="-80px" size="380px" color="white" />
      <AmbientBlob bottom="-120px" right="-60px" size="300px" color="#C7A4FF" />
      <AmbientBlob
        top="40%"
        left="55%"
        size="220px"
        color="#E9D8FD"
        opacity={0.45}
      />

      <Container maxW="7xl" position="relative" zIndex={5}>
        <Grid templateColumns={["1fr", null, "240px 1fr"]} gap={12}>
          {/* -------------------------- SIDEBAR --------------------------- */}
          <GridItem>
            <Flex
              direction="column"
              align="center"
              sx={glass}
              p={6}
              bg={glassBg}
            >
              {/* Avatar with neon glass ring */}
              <Box
                p="6px"
                borderRadius="full"
                bg="whiteAlpha.700"
                border="2px solid #faf7ff51"
                boxShadow="0 0 25px rgba(183,148,244,0.6)"
              >
                <Avatar
                  size="xl"
                  name={user.name}
                  src={`${import.meta.env.VITE_BACKEND_URL}/img/users/${
                    user.photo
                  }`}
                />
              </Box>

              <Text mt={4} fontSize="lg" fontWeight="bold" color="purple.700">
                {user.name}
              </Text>

              {/* New modern nav */}
              <VStack spacing={2} mt={8} w="100%">
                <SidebarLink icon={FiSettings} label="Settings" active />
                <SidebarLink icon={FiUser} label="Bookings" />
                <SidebarLink icon={FiUser} label="Reviews" />
                <SidebarLink icon={FiUser} label="Billing" />
              </VStack>

              {/* Admin */}
              {user.role === "admin" && (
                <>
                  <Divider my={6} />
                  <Text fontSize="xs" textTransform="uppercase" opacity={0.6}>
                    Admin Tools
                  </Text>

                  <VStack spacing={2} mt={3} w="100%">
                    <SidebarLink label="Manage Tours" admin />
                    <SidebarLink label="Manage Users" admin />
                    <SidebarLink label="Manage Reviews" admin />
                  </VStack>
                </>
              )}
            </Flex>
          </GridItem>

          {/* ------------------------- MAIN CONTENT ------------------------- */}
          <GridItem>
            <VStack spacing={10}>
              {/* PROFILE CARD */}
              <MotionBox
                sx={glass}
                bg={glassBg}
                p={8}
                w="100%"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <CardHeader title="Profile Information" icon={FiUser} />

                <form onSubmit={handleUserData}>
                  <VStack spacing={5}>
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        name="name"
                        defaultValue={user.name}
                        bg="whiteAlpha.700"
                        size="md"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        bg="whiteAlpha.700"
                        size="md"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Profile Photo</FormLabel>

                      <Flex
                        align="center"
                        gap={4}
                        p={3}
                        borderRadius="md"
                        bg="whiteAlpha.700"
                        backdropFilter="blur(10px)"
                        border="1px solid rgba(0,0,0,0.1)"
                        _hover={{ borderColor: "purple.400" }}
                        transition="0.2s"
                        cursor="pointer"
                        as="label"
                        htmlFor="photoUpload"
                      >
                        <Button colorScheme="purple" size="sm">
                          Upload Photo
                        </Button>

                        <Text
                          fontSize="sm"
                          color="gray.600"
                          noOfLines={1}
                          flex="1"
                          id="uploadFilename"
                        >
                          No file chosen
                        </Text>
                      </Flex>

                      {/* hidden real file input */}
                      <Input
                        id="photoUpload"
                        name="photo"
                        type="file"
                        accept="image/*"
                        display="none"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          document.getElementById(
                            "uploadFilename"
                          ).textContent = file ? file.name : "No file chosen";
                        }}
                      />
                    </FormControl>

                    <Button mt={3} colorScheme="purple" w="160px" type="submit">
                      Save Changes
                    </Button>
                  </VStack>
                </form>
              </MotionBox>

              {/* PASSWORD CARD */}
              <MotionBox
                sx={glass}
                bg={glassBg}
                p={8}
                w="100%"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <CardHeader title="Change Password" icon={FiLock} />

                <form onSubmit={handlePassword}>
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel isRequired>Current Password</FormLabel>
                      <Input
                        name="passwordCurrent"
                        type="password"
                        required
                        bg="whiteAlpha.700"
                        size="md"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>New Password</FormLabel>
                      <Input
                        name="password"
                        type="password"
                        required
                        bg="whiteAlpha.700"
                        size="md"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        name="passwordConfirm"
                        type="password"
                        required
                        bg="whiteAlpha.700"
                        size="md"
                      />
                    </FormControl>

                    <Button mt={3} colorScheme="purple" w="180px" type="submit">
                      Update Password
                    </Button>
                  </VStack>
                </form>
              </MotionBox>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}

/* -------------------------- COMPONENTS -------------------------- */

function SidebarLink({ icon, label, active = false, admin = false }) {
  return (
    <Flex
      w="100%"
      align="center"
      gap={3}
      px={4}
      py={2}
      borderRadius="md"
      cursor="pointer"
      bg={active ? "purple.200" : "whiteAlpha.500"}
      _hover={{ bg: admin ? "pink.200" : "purple.100" }}
      transition="0.2s"
    >
      {icon && <Icon as={icon} color="purple.600" />}
      <Text>{label}</Text>
    </Flex>
  );
}

function CardHeader({ icon, title }) {
  return (
    <HStack mb={6}>
      <Icon as={icon} w={6} h={6} color="purple.500" />
      <Heading fontSize="xl">{title}</Heading>
    </HStack>
  );
}

// VisionOS floating ambient blobs
function AmbientBlob({
  top,
  left,
  bottom,
  right,
  size,
  color,
  opacity = 0.55,
}) {
  return (
    <Box
      position="absolute"
      top={top}
      left={left}
      bottom={bottom}
      right={right}
      w={size}
      h={size}
      bg={color}
      opacity={opacity}
      filter="blur(130px)"
      borderRadius="50%"
      pointerEvents="none"
    />
  );
}
