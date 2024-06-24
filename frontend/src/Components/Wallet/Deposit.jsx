import {
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { UserState } from "../../Context/UserProvider";

const Deposit = () => {
  const [depositFormData, setDepositFormData] = useState({
    amount: 0,
    utr: "",
    transaction: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { depositMoney } = UserState();
  const toast = useToast();

  const resetFormData = () => {
    setDepositFormData({ amount: 0, utr: "", transaction: null });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log(name, value);
    if (name === "transaction" && type === "file") {
      setDepositFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Store the file object instead of value
      }));
    } else {
      setDepositFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const errors = {};

    if (!depositFormData.amount) errors.amount = "Amount is required.";
    if (!depositFormData.utr) errors.utr = "UTR is required.";
    if (!depositFormData.transaction)
      errors.transaction = "Transaction screenshot is required.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      console.log(depositFormData);

      formData.append("amount", depositFormData.amount);
      formData.append("utr", depositFormData.utr);
      formData.append("transaction", depositFormData.transaction);

      console.log(formData);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await depositMoney(formData);
      if (response.success) {
        resetFormData();
      }
    } catch (error) {
      toast({
        title: `Error occured`,
        description: `${error}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={2} overflow={"scroll"}>
      <Heading padding={2}>Deposit</Heading>
      <Text>
        • Fill the form only after making the transaction.
        <Text>• Make Transaction only to the given bank accounts.</Text>
      </Text>
      <Text>• Transaction screenshot and UTR are mandatory.</Text>
      <VStack
        marginLeft={"auto"}
        marginRight={"auto"}
        marginTop={6}
        padding={2}
        border={"1px solid black"}
        borderRadius={"10px"}
        maxWidth={"80%"}
      >
        <FormControl isRequired isInvalid={errors.amount}>
          <FormLabel>Amount</FormLabel>
          <Input
            name="amount"
            type="number"
            value={depositFormData.amount}
            onChange={handleChange}
            placeholder="Enter the amount you deposited."
          />
          {errors.amount && (
            <FormErrorMessage>{errors.amount}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={errors.utr}>
          <FormLabel>UTR</FormLabel>
          <Input
            name="utr"
            type="string"
            value={depositFormData.utr}
            onChange={handleChange}
            placeholder="Enter the UTR number of the transaction you made."
          />
          {errors.utr && <FormErrorMessage>{errors.utr}</FormErrorMessage>}
        </FormControl>
        <FormControl isRequired isInvalid={errors.transaction}>
          <FormLabel>Transaction Screenshot</FormLabel>
          <Input
            name="transaction"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {errors.transaction && (
            <FormErrorMessage>{errors.transaction}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          width={"80%"}
          isLoading={loading}
        >
          Submit Deposit
        </Button>
      </VStack>
    </Box>
  );
};

export default Deposit;
