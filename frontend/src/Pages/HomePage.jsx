import React from "react";
import Loading from "../Components/Miscellaneous/Loading";
import { AuthState } from "../Context/AuthProvider";

const HomePage = () => {
  const { user } = AuthState();

  return !user ? <Loading /> : <Box>Home Page</Box>;
};

export default HomePage;
