// src/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
