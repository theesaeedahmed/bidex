import { Box, Heading, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import React from "react";
import UserAvatar from "./UserAvatar";
import WalletStatus from "./WalletStatus";
import { useNavigate } from "react-router-dom";

const Header = ({
  isAdminPage = false,
  onSideBarIconClicked = () => {},
  sideBarOpen = false,
}) => {
  const navigate = useNavigate();
  return (
    <Box minHeight={"50px"} margin={3} position={"sticky"} zIndex={"sticky"}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {isAdminPage && (
          <IconButton
            aria-label="Search database"
            icon={sideBarOpen ? <ArrowBackIcon /> : <HamburgerIcon />}
            onClick={onSideBarIconClicked}
          />
        )}
        <Heading
          size={"xl"}
          color={"#453434"}
          onClick={(e) => navigate("/home")}
          _hover={{ cursor: "pointer" }}
        >
          BIDEX
        </Heading>
        <UserAvatar showTransactionsOption={!isAdminPage} />
      </Box>
      {!isAdminPage && (
        <Box justifyContent={"center"} display={"flex"} marginTop={2}>
          <WalletStatus />
        </Box>
      )}
    </Box>
  );
};

export default Header;
