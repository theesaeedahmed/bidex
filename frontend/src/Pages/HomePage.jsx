import React, { useState } from "react";
import Loading from "../Components/Miscellaneous/Loading";
import { AuthState } from "../Context/AuthProvider";
import { Box, Text } from "@chakra-ui/react";
import Navbar from "../Components/Home/Navbar";
import Header from "../Components/Miscellaneous/Header";
import InPlay from "../Components/Home/InPlay";
import MyStocks from "../Components/Home/MyStocks";
import UpcomingMatches from "../Components/Home/UpcomingMatches";
import ContactUs from "../Components/Home/ContactUs";

const HomePage = () => {
  const { user } = AuthState();
  const [renderedComponent, setRenderedComponent] = useState(0);

  const components = [
    <InPlay />,
    <MyStocks />,
    <UpcomingMatches />,
    <ContactUs />,
  ];

  return !user ? (
    <Loading />
  ) : (
    <Box
      display={"flex"}
      flexDir={"column"}
      overflow={"scroll"}
      width={"100%"}
      height={"100vh"}
    >
      <Header />
      <Navbar setRenderedComponent={setRenderedComponent} />
      <Box bgColor={"white"} flex={1}>
        {components[renderedComponent]}
      </Box>
    </Box>
  );
};

export default HomePage;
