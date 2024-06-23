import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const Loading = () => {
  return (
    <Box
      height={"100vh"}
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        flex={1}
        height={"100%"}
        width={"100%"}
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        color={"blue"}
      >
        <Spinner size={"xl"}></Spinner>
        <Text>Loading your data...</Text>
      </Box>
    </Box>
  );
};

export default Loading;
