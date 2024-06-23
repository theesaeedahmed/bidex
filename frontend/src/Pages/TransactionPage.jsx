import { Box } from "@chakra-ui/react";
import React from "react";
import { AuthState } from "../Context/AuthProvider";
import Loading from "../Components/Miscellaneous/Loading";

const TransactionPage = () => {
  const { user } = AuthState();

  return !user ? <Loading /> : <Box>Transactions | Deposit | Withdraw</Box>;
};

export default TransactionPage;
