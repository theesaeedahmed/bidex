import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import { UserState } from "../../Context/UserProvider";
import { LayoutState } from "../../Context/LayoutProvider";
import Transaction from "../Miscellaneous/Transaction";

const AllTransactions = () => {
  const { screenWidth } = LayoutState();
  const { wallet } = UserState();
  const [openTransaction, setOpenTransaction] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(400);
  const tableRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const modifiedOnClose = () => {
    setOpenTransaction(null);
    onClose();
  };

  const modifiedOnOpen = (transaction) => {
    setOpenTransaction(transaction);
    onOpen();
  };

  useEffect(() => {
    if (tableRef.current) {
      const rect = tableRef.current.getBoundingClientRect();
      setHeaderHeight(rect.top + 20);
    }
  }, []);

  return (
    <>
      {isOpen && (
        <Transaction
          transaction={openTransaction}
          isOpen={isOpen}
          onClose={modifiedOnClose}
        />
      )}
      <Box padding={2} overflow={"scroll"} paddingTop={4}>
        <Heading>Transactions</Heading>
        {wallet?.transactions?.length > 0 && (
          <TableContainer
            ref={tableRef}
            marginTop={5}
            maxHeight={`calc(100vh - ${headerHeight}px)`}
            overflowY={"auto"}
            border={"1px solid black"}
            borderRadius={"15px"}
          >
            <Table variant="simple">
              <Thead
                bgColor={"blue"}
                color={"white"}
                position={"sticky"}
                zIndex={"sticky"}
                top={0}
              >
                <Tr color={"white"}>
                  <Th
                    color={"white"}
                    maxWidth={"80px"}
                    overflow={"none"}
                    textAlign={"center"}
                  >
                    Date
                  </Th>
                  <Th
                    textAlign={"center"}
                    color={"white"}
                    maxWidth={"80px"}
                    overflow={"none"}
                  >
                    Amount
                  </Th>
                  <Th
                    textAlign={"center"}
                    color={"white"}
                    maxWidth={"80px"}
                    overflow={"none"}
                  >
                    Status
                  </Th>
                  <Th
                    textAlign={"center"}
                    color={"white"}
                    maxWidth={"90px"}
                    overflow={"none"}
                  >
                    Type
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {wallet?.transactions?.map((transaction) => {
                  return (
                    <Tr
                      key={transaction._id}
                      onClick={(e) => modifiedOnOpen(transaction)}
                      _hover={{
                        // bgColor: "red",
                        cursor: "pointer",
                        color: "#e48787",
                      }}
                    >
                      <Td
                        textAlign={"center"}
                        maxWidth={"80px"}
                        overflow={"none"}
                      >
                        {transaction.createdAt.split("T")[0]}
                      </Td>
                      <Td
                        textAlign={"center"}
                        maxWidth={"80px"}
                        overflow={"none"}
                      >
                        {transaction.amount}
                      </Td>
                      <Td
                        textAlign={"center"}
                        maxWidth={"80px"}
                        overflow={"none"}
                      >
                        {transaction.status}
                      </Td>
                      <Td
                        textAlign={"center"}
                        maxWidth={"80px"}
                        overflow={"none"}
                      >
                        {transaction.type}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
        {wallet?.transactions?.length <= 0 && (
          <Text>No transactions on this wallet.</Text>
        )}
      </Box>
    </>
  );
};

export default AllTransactions;
