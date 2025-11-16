import { Alert } from "@chakra-ui/react";

export default function ToastAlert({ status = "info", children }) {
  return (
    <Alert.Root
      status={status}
      borderRadius="md"
      p={4}
      bg="white"
      color="gray.800"
      boxShadow="md"
      width="auto"
    >
      <Alert.Indicator />
      <Alert.Title>{children}</Alert.Title>
    </Alert.Root>
  );
}
