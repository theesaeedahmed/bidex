import {
  Avatar,
  Box,
  Button,
  Divider,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { AuthState } from "../../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";

const UserAvatar = () => {
  const { onClose, isOpen, onToggle } = useDisclosure();
  const {
    onClose: onProfileModalClose,
    onOpen: onProfileModalOpen,
    isOpen: isProfileModalOpen,
  } = useDisclosure();
  const { logoutUser } = AuthState();
  const navigate = useNavigate();

  const onProfileClicked = (e) => {
    onProfileModalOpen();
    onClose();
  };

  const onLogoutClicked = async (e) => {
    await logoutUser();
    onClose();
  };

  const onTransactionsClicked = async (e) => {
    navigate("/transactions", { state: 0 });
    onClose();
  };

  return (
    <>
      <ProfileModal isOpen={isProfileModalOpen} onClose={onProfileModalClose} />
      <Popover size={"sm"} isOpen={isOpen} onClose={onClose} closeOnBlur={true}>
        <PopoverTrigger>
          <Avatar
            marginTop={2}
            size={"sm"}
            _hover={{ cursor: "pointer" }}
            onClick={onToggle}
          ></Avatar>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            border={"1px solid black"}
            maxWidth={"120px"}
            overflow={"none"}
            padding={"0px !important"}
            margin={"0px !important"}
          >
            <PopoverArrow border={"1px solid black"} />
            <PopoverBody>
              <Box onClick={onProfileClicked}>
                <Button
                  bgColor={"inherit"}
                  size={"sm"}
                  _hover={{ bgColor: "inherit", fontWeight: "700" }}
                >
                  Profile
                </Button>
              </Box>
              <Divider color={"black"} />
              <Box onClick={onTransactionsClicked}>
                <Button
                  bgColor={"inherit"}
                  size={"sm"}
                  _hover={{ bgColor: "inherit", fontWeight: "700" }}
                >
                  Transactions
                </Button>
              </Box>
              <Divider color={"black"} />
              <Box onClick={onLogoutClicked}>
                <Button
                  bgColor={"inherit"}
                  size={"sm"}
                  _hover={{ bgColor: "inherit", fontWeight: "700" }}
                >
                  Logout
                </Button>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

export default UserAvatar;
