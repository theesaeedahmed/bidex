import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import UserAvatar from "./UserAvatar";
import WalletStatus from "./WalletStatus";

const Header = () => {
  return (
    <Box minHeight={"50px"} margin={3}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Heading size={"xl"} color={"#453434"}>
          BIDEX
        </Heading>
        <UserAvatar />
      </Box>
      <Box justifyContent={"center"} display={"flex"} marginTop={2}>
        <WalletStatus />
      </Box>
    </Box>
  );
};

export default Header;
