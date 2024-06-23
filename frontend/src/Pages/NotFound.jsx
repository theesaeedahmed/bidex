import { Box, Heading, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/home");
    }, [3000]);
  }, []);

  return (
    <Box>
      <Box padding={4}>
        <Heading>404 Page Not Found</Heading>
        <Text>Redirecting...</Text>
      </Box>
    </Box>
  );
};

export default NotFound;
