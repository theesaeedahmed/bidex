import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";

import React from "react";
import { AuthState } from "../../Context/AuthProvider";
import { LayoutState } from "../../Context/LayoutProvider";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = AuthState();
  const { screenWidth } = LayoutState();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={screenWidth < 420 ? "80%" : "400px"}>
        <ModalHeader>Profile Information</ModalHeader>
        <ModalBody>
          <Box display={"flex"} gap={4}>
            <Text fontWeight={700}>Username: </Text>
            <Text color={"black"}>{user.username}</Text>
          </Box>
          <Box display={"flex"} gap={12}>
            <Text fontWeight={700}>Email: </Text>
            <Text color={"black"}>{user.email}</Text>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
