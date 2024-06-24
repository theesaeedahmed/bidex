import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import UserAvatar from "./UserAvatar";
import WalletStatus from "./WalletStatus";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <Box minHeight={"50px"} margin={3} position={"sticky"} zIndex={"sticky"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Heading
          size={"xl"}
          color={"#453434"}
          onClick={(e) => navigate("/home")}
          _hover={{ cursor: "pointer" }}
        >
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
