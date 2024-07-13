import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AuthState } from "../../Context/AuthProvider";

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginUser } = AuthState();
  const toast = useToast();

  const resetFormData = () => {
    setFormData({ email: "", password: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const isValidEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(formData.email);
  };

  const validate = () => {
    const errors = {};

    if (!formData.email) errors.email = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    if (!isValidEmail()) errors.email = "Invalid email.";

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
      resetFormData();
      const response = await loginUser(formData, true);
    } catch (error) {
      console.log(error);
      toast({
        title: `Error occured`,
        description: `${error.response.data.message}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetFormData();
  }, []);

  return (
    <Box
      height={"100%"}
      width={"100%"}
      overflow={"scroll"}
      display={"flex"}
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        fontSize={"80px"}
        fontWeight={800}
        color={"#453434"}
        marginBottom={4}
      >
        BIDEX
      </Box>
      <Box bgColor={"white"} padding={4} borderRadius={"10px"} marginY={3}>
        <Box padding={2}>
          <Heading>Admin Panel Login</Heading>
          <VStack marginY={8} gap={3}>
            <FormControl id="login-email" isRequired isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <InputGroup size={"md"}>
                <Input
                  name="email"
                  placeholder="Enter Your Email Address"
                  onChange={handleChange}
                  value={formData.email}
                />
              </InputGroup>
              {errors.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              id="login-password"
              isRequired
              isInvalid={errors.password}
            >
              <FormLabel>Password</FormLabel>
              <InputGroup size={"md"}>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                />
                <InputRightElement w={"3.5rem"}>
                  <Button
                    bgColor={"inherit !important"}
                    h={"1.75rem"}
                    size={"sm"}
                    onClick={(e) => setShowPassword((show) => !show)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              isLoading={loading}
              colorScheme="blue"
              w={"100%"}
              marginTop={"15px"}
              onClick={handleSubmit}
            >
              Login
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSignIn;
