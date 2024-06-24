import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";

const Nav = ({ children, value, handleClick }) => {
  return (
    <Button
      bgColor={"inherit"}
      borderRadius={0}
      textAlign={"center"}
      width={"100%"}
      padding={2}
      _hover={{ cursor: "pointer", bgColor: "purple", color: "white" }}
      value={value}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default Nav;
