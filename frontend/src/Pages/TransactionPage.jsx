import { Box, Button, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AuthState } from "../Context/AuthProvider";
import Loading from "../Components/Miscellaneous/Loading";
import Header from "../Components/Miscellaneous/Header";
import { useLocation, useNavigate } from "react-router-dom";
import AllTransactions from "../Components/Wallet/AllTransactions";
import Deposit from "../Components/Wallet/Deposit";
import Withdrawal from "../Components/Wallet/Withdrawal";

const TransactionPage = () => {
  const [renderedComponent, setRenderedComponent] = useState();
  const { user } = AuthState();
  const navigate = useNavigate();
  const location = useLocation();

  const components = [<AllTransactions />, <Deposit />, <Withdrawal />];

  const onBackToHomePageClicked = (e) => {
    navigate("/home");
  };

  useEffect(() => {
    if (location.state) {
      setRenderedComponent(location.state);
    } else {
      setRenderedComponent(0);
    }
  }, [location, navigate]);

  return !user ? (
    <Loading />
  ) : (
    <Box display={"flex"} flexDir={"column"} height={"100%"} width={"100%"}>
      <Header />
      <Button borderRadius={0} onClick={onBackToHomePageClicked}>
        Back to Home Page
      </Button>
      <Box bgColor={"white"} flex={1}>
        {components[renderedComponent]}
      </Box>
    </Box>
  );
};

export default TransactionPage;
