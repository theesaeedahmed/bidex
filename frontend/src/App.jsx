import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import NotFound from "./Pages/NotFound";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import LandingPage from "./Pages/LandingPage";
import TransactionPage from "./Pages/TransactionPage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AdminPage from "./Pages/AdminPage";
import AdminSignIn from "./Components/Admin/AdminSignIn";

const App = () => {
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
        <Route path="/auth">
          <Route path="/auth/" element={<AuthPage />}></Route>
          <Route path="/auth/admin" element={<AdminSignIn />}></Route>
        </Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/transactions" element={<TransactionPage />}></Route>
        <Route path="/admin">
          <Route path="/admin/" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Box>
  );
};

export default App;
