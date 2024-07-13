import { CloseIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, IconButton, Text } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { LayoutState } from "../../Context/LayoutProvider";

const SideBar = ({ isOpen, onClose }) => {
  const { screenWidth } = LayoutState();
  const sideBarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Box
      ref={sideBarRef}
      position="fixed"
      top={0}
      left={0}
      width="250px"
      height="100vh"
      bgColor="gray.800"
      color="white"
      display={isOpen ? "block" : "none"}
      zIndex="overlay"
    >
      <Box
        display="flex"
        justifyContent={"space-between"}
        padding="10px"
        alignItems={"center"}
      >
        <Heading>{screenWidth < 420 ? "BIDEX" : "Settings"}</Heading>
        <IconButton
          onClick={onClose}
          icon={<CloseIcon />}
          color={"white"}
          bgColor={"inherit"}
        ></IconButton>
      </Box>
      <Box padding="20px">
        {/* Add your sidebar content here */}
        <Text>SideBar Content</Text>
      </Box>
    </Box>
  );
};

export default SideBar;
