import { Box, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const Loading = () => {
  return (
    <Box
      height={"100%"}
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
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner size={"xl"}></Spinner>
        <Text>Loading your data...</Text>
      </Box>
    </Box>
  );
};

export default Loading;
