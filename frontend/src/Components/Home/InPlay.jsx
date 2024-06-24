import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { UserState } from "../../Context/UserProvider";

const InPlay = () => {
  const { liveMatches } = UserState();

  return (
    <Box padding={2} overflow={"scroll"}>
      <Heading padding={2}>Live Matches</Heading>
      {!liveMatches && (
        <Box
          height={"30vh"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text>No live matches</Text>
        </Box>
      )}
    </Box>
  );
};

export default InPlay;
