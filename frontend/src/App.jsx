import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import NotFound from "./Pages/NotFound";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import LandingPage from "./Pages/LandingPage";
import TransactionPage from "./Pages/TransactionPage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthState } from "./Context/AuthProvider";

const App = () => {
  const { user } = AuthState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && (location.pathname === "/" || location.pathname === "/auth")) {
      navigate("/home");
    }
  }, [user]);

  return (
    <Box
      margin={0}
      padding={0}
      bgColor={"#9696c3"}
      height={"100vh"}
      width={"100vw"}
      position={"fixed"}
      overflow={"scroll"}
    >
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/auth" element={<AuthPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/transactions" element={<TransactionPage />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Box>
  );
};

export default App;
