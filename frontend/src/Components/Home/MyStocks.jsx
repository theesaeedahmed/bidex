import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { UserState } from "../../Context/UserProvider";

const MyStocks = () => {
  const { myStocks } = UserState();

  return (
    <Box padding={2} overflow={"scroll"}>
      <Heading padding={2}>My Stocks</Heading>
      {!myStocks && (
        <Box
          height={"30vh"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text>No live stocks</Text>
        </Box>
      )}
    </Box>
  );
};

export default MyStocks;
