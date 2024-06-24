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
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LayoutState } from "../../Context/LayoutProvider";
import { UserState } from "../../Context/UserProvider";

const WithdrawalModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ amount: 0 });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { screenWidth } = LayoutState();
  const { withdrawMoney } = UserState();

  const resetFormData = () => {
    setFormData({ amount: 0, utr: "", transaction: null });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.amount) errors.amount = "Amount is required.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    // console.log(typeof fo);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await withdrawMoney(formData.amount);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth={screenWidth < 420 ? "80%" : "400px"}>
        <ModalHeader>Withdraw Money</ModalHeader>
        <ModalBody>
          <Box marginBottom={3}>
            <Text fontWeight={700}>Note:</Text>
            <Text>• Make sure your wallet has sufficient balance.</Text>
            <Text>• Make sure your bank account details are updated.</Text>
          </Box>
          <Box display={"flex"}>
            <FormControl isRequired isInvalid={errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter the amount you deposited."
              />
              {errors.amount && (
                <FormErrorMessage>{errors.amount}</FormErrorMessage>
              )}
            </FormControl>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Submit Request
          </Button>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WithdrawalModal;
