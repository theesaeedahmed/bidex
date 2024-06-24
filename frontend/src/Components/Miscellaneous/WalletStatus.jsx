import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserState } from "../../Context/UserProvider";
import { LayoutState } from "../../Context/LayoutProvider";
import WithdrawalModal from "./WithdrawalModal";

const WalletStatus = () => {
  const { wallet } = UserState();
  const { screenWidth } = LayoutState();
  const navigate = useNavigate();
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleWalletStatusClicked = (e) => {
    if (
      location.pathname !== "/transactions" ||
      (location.pathname === "/transactions" && location.state)
    ) {
      navigate("/transactions");
    }
  };

  const handleTransactionOperation = (e) => {
    navigate("/transactions", { state: e.target.value });
  };

  return (
    <>
      <WithdrawalModal isOpen={isOpen} onClose={onClose} />
      <Box
        marginTop={3}
        width={"85%"}
        minHeight={"30px"}
        bgColor={"white"}
        borderRadius={"10px"}
        display={"flex"}
        flexDir={"column"}
      >
        <Box
          _hover={
            (location.pathname !== "/transactions" ||
              (location.pathname === "/transactions" && location.state)) && {
              cursor: "pointer",
              color: "brown",
              scale: "1.1",
              boxShadow: "2px 2px 10px 2px grey",
            }
          }
          onClick={handleWalletStatusClicked}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            padding={3}
            paddingBottom={1}
          >
            <Text fontSize={"16px"} fontWeight={700}>
              Available Balance:
            </Text>
            <Text>{wallet?.balance} INR</Text>
          </Box>
          <Box display={"flex"} flexDir={"column"} padding={3} paddingTop={1}>
            <Text fontSize={"16px"} fontWeight={700}>
              Unsettled Balance:
            </Text>
            <Box
              display={"flex"}
              flexDir={screenWidth < 600 ? "column" : "row"}
              alignItems={screenWidth < 600 ? "left" : "center"}
              justifyContent={"space-around"}
              paddingTop={0}
              width={"100%"}
            >
              <Box display={"flex"} alignItems={"center"} gap={2} marginX={3}>
                <Text fontSize={"13px"} fontWeight={700}>
                  Deposit:
                </Text>
                <Text fontSize={"13px"}>
                  {wallet?.unsettledBalance?.deposit} INR
                </Text>
              </Box>
              <Box display={"flex"} alignItems={"center"} gap={2} marginX={3}>
                <Text fontSize={"13px"} fontWeight={700}>
                  Withdrawal:
                </Text>
                <Text fontSize={"13px"}>
                  {wallet?.unsettledBalance?.withdrawal} INR
                </Text>
              </Box>
              <Box display={"flex"} alignItems={"center"} gap={2} marginX={3}>
                <Text fontSize={"13px"} fontWeight={700}>
                  Winnings:
                </Text>
                <Text fontSize={"13px"}>
                  {wallet?.unsettledBalance?.winnings} INR
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display={"flex"} justifyContent={"space-evenly"}>
          <Button
            colorScheme="green"
            width={"100%"}
            borderRadius={0}
            value={"1"}
            onClick={handleTransactionOperation}
            // border={"1px solid black"}
          >
            Deposit
          </Button>
          <Button
            colorScheme="red"
            width={"100%"}
            borderRadius={0}
            onClick={onOpen}
            // border={"1px solid black"}
          >
            Withdraw
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default WalletStatus;
