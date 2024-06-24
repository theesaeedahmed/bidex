import React, { useState } from "react";
import Loading from "../Components/Miscellaneous/Loading";
import { AuthState } from "../Context/AuthProvider";
import { Box, Text } from "@chakra-ui/react";
import Navbar from "../Components/Home/Navbar";
import Header from "../Components/Miscellaneous/Header";

const HomePage = () => {
  const { user } = AuthState();
  const [renderedComponent, setRenderedComponent] = useState(0);

  const components = [
    <Text color={"black"}>In Play</Text>,
    <Text>My Stocks</Text>,
    <Text>Upcoming Matches</Text>,
    <Text>Contact Us</Text>,
  ];

  return !user ? (
    <Loading />
  ) : (
    <Box display={"flex"} flexDir={"column"} height={"100%"} width={"100%"}>
      <Header />
      <Navbar setRenderedComponent={setRenderedComponent} />
      <Box bgColor={"white"} flex={1}>
        {components[renderedComponent]}
      </Box>
    </Box>
  );
};

export default HomePage;
