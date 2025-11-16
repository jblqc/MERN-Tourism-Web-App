"use client";

import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast({
  defaultOptions: {
    position: "bottom-right",
    duration: 3000,
    isClosable: true,
  },
});

export const useToastMessage = () => {
  const showSuccess = (title, description = "") =>
    toast({
      status: "success",
      title,
      description,
    });

  const showError = (title, description = "") =>
    toast({
      status: "error",
      title,
      description,
    });

  const showWarning = (title, description = "") =>
    toast({
      status: "warning",
      title,
      description,
    });

  const showInfo = (title, description = "") =>
    toast({
      status: "info",
      title,
      description,
    });

  return { showSuccess, showError, showWarning, showInfo };
};
