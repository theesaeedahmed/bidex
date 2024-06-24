import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";

const Nav = ({ children, value, handleClick, isActive }) => {
  return (
    <Button
      bgColor={isActive ? "purple" : "inherit"}
      color={isActive ? "white" : "black"}
      borderX={"1px solid black"}
      borderRadius={0}
      textAlign={"center"}
      width={"100%"}
      padding={2}
      _hover={{ cursor: "pointer", bgColor: "purple", color: "white" }}
      value={value}
      onClick={(e) => handleClick(value)}
    >
      {children}
    </Button>
  );
};

export default Nav;
