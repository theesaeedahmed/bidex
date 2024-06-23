import { Box, Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import SignIn from "../Components/Auth/SignIn";
import SignUp from "../Components/Auth/SignUp";

const AuthPage = () => {
  const [renderedComponent, setRenderedComponent] = useState(0);

  const components = [<SignIn />, <SignUp />];

  const handleComponentChange = (e) => {
    if (renderedComponent === 0) {
      setRenderedComponent(1);
    } else {
      setRenderedComponent(0);
    }
  };

  return (
    <Box
      height={"100%"}
      width={"100%"}
      overflow={"scroll"}
      display={"flex"}
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        fontSize={"80px"}
        fontWeight={800}
        color={"#453434"}
        marginBottom={4}
      >
        BIDEX
      </Box>
      <Box bgColor={"white"} padding={4} borderRadius={"10px"} marginY={3}>
        {components[renderedComponent]}
        <Text
          _hover={{ cursor: "pointer" }}
          color={"blue"}
          fontSize={"12px"}
          fontWeight={600}
          onClick={handleComponentChange}
          textAlign={"center"}
        >
          {renderedComponent === 0
            ? "Don't have an account? Register here."
            : "Have an existing account? Login here."}
        </Text>
      </Box>
    </Box>
  );
};

export default AuthPage;
