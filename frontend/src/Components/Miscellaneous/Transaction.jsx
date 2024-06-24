import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Box,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { LayoutState } from "../../Context/LayoutProvider";

const Transaction = ({ transaction, isOpen, onClose }) => {
  const { screenWidth } = LayoutState();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={screenWidth < 420 ? "90%" : "450px"}>
        <ModalHeader>Transaction Information</ModalHeader>
        <ModalBody>
          <Box display={"flex"} paddingY={3}>
            <Box
              display={"flex"}
              flexDir={"column"}
              fontWeight={700}
              padding={screenWidth < 420 ? 1 : 2}
              fontSize={screenWidth < 420 ? "sm" : "auto"}
            >
              <Text>Transaction#</Text>
              <Text>Amount</Text>
              <Text>Type</Text>
              <Text>Status</Text>
              <Text>Created At</Text>
              <Text>Updated At</Text>
              {transaction.utr && <Text>UTR</Text>}
            </Box>
            <Box
              display={"flex"}
              flex={1}
              flexDir={"column"}
              padding={screenWidth < 420 ? 1 : 2}
              fontSize={screenWidth < 420 ? "sm" : "auto"}
            >
              <Text>{transaction._id}</Text>
              <Text>{transaction.amount}</Text>
              <Text>{transaction.type}</Text>
              <Text>{transaction.status}</Text>
              <Text>{transaction.createdAt.split("T")[0]}</Text>
              <Text>
                {transaction.updatedAt === transaction.createdAt
                  ? "Not Updated"
                  : transaction.updatedAt.split("T")[0]}
              </Text>
              {transaction.utr && <Text>{transaction.utr}</Text>}
            </Box>
          </Box>
          {transaction.screenshot && <Image src={transaction.screenshot} />}
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

export default Transaction;
