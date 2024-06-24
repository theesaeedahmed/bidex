import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { UserState } from "../../Context/UserProvider";

const UpcomingMatches = () => {
  const { upcomingMatches } = UserState();

  return (
    <Box padding={2} overflow={"scroll"}>
      <Heading padding={2}>Upcoming Matches</Heading>
      {!upcomingMatches && (
        <Box
          height={"30vh"}
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Text>No upcoming matches</Text>
        </Box>
      )}
    </Box>
  );
};

export default UpcomingMatches;
