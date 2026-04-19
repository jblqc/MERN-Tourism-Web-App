import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { appConfig } from "./config/env";

const appTree = (
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  appConfig.googleClientId ? (
    <GoogleOAuthProvider clientId={appConfig.googleClientId}>
      {appTree}
    </GoogleOAuthProvider>
  ) : (
    appTree
  )
);
