import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";

export default function VerificationModal({
  isOpen,
  onClose,
  mode,
  value,
  setValue,
  code,
  setCode,
  loading,
  isCodeSent,
  onSend,
  onVerify,
}) {
  const label = mode === "email" ? "Email Address" : "Phone Number";
  const description =
    mode === "email"
      ? "Enter your email address and we’ll send a 6-digit login code."
      : "Enter your mobile number and we’ll send a 6-digit SMS code.";

  const sentMessage =
    mode === "email"
      ? `We sent a code to ${value}.`
      : `We sent an SMS code to ${value}.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" p={4}>
        <ModalHeader textAlign="center">
          {isCodeSent ? "Enter Verification Code" : `Login via ${mode}`}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            {!isCodeSent ? (
              <>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  {description}
                </Text>

                <Input
                  placeholder={label}
                  size="lg"
                  borderRadius="lg"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />

                <Button
                  colorScheme="purple"
                  w="100%"
                  borderRadius="lg"
                  isLoading={loading}
                  onClick={onSend}
                >
                  Send Code
                </Button>
              </>
            ) : (
              <>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  {sentMessage}
                </Text>

                <Input
                  placeholder="6-digit code"
                  size="lg"
                  maxLength={6}
                  borderRadius="lg"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <Button
                  colorScheme="purple"
                  w="100%"
                  borderRadius="lg"
                  isLoading={loading}
                  onClick={onVerify}
                >
                  Verify & Login
                </Button>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
