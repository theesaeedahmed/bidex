import { Box, Button, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AuthState } from "../Context/AuthProvider";
import Loading from "../Components/Miscellaneous/Loading";
import Header from "../Components/Miscellaneous/Header";
import { useLocation, useNavigate } from "react-router-dom";
import AllTransactions from "../Components/Wallet/AllTransactions";
import Deposit from "../Components/Wallet/Deposit";

const TransactionPage = () => {
  const [renderedComponent, setRenderedComponent] = useState();
  const { user } = AuthState();
  const navigate = useNavigate();
  const location = useLocation();

  const components = [<AllTransactions />, <Deposit />];

  const onBackToHomePageClicked = (e) => {
    navigate("/home");
  };

  useEffect(() => {
    if (location.pathname === "/transactions" && location.state) {
      setRenderedComponent(location.state);
    } else {
      setRenderedComponent(0);
    }
  }, [location, navigate]);

  return !user ? (
    <Loading />
  ) : (
    <Box
      display={"flex"}
      flexDir={"column"}
      width={"100%"}
      overflow={"scroll"}
      height={"100vh"}
    >
      <Header />
      <Button borderRadius={0} onClick={onBackToHomePageClicked}>
        Back to Home Page
      </Button>
      <Box bgColor={"white"} flex={1} overflow={"scroll"}>
        {components[renderedComponent]}
      </Box>
    </Box>
  );
};

export default TransactionPage;
