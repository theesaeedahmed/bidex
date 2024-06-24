import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import AuthProvider from "./Context/AuthProvider.jsx";
import UserProvider from "./Context/UserProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import LayoutProvider from "./Context/LayoutProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChakraProvider>
      <LayoutProvider>
        <AuthProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </AuthProvider>
      </LayoutProvider>
    </ChakraProvider>
  </BrowserRouter>
);
