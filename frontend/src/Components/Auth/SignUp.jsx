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
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AuthState } from "../../Context/AuthProvider";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { registerUser } = AuthState();
  const toast = useToast();

  const resetFormData = () => {
    setFormData({ email: "", password: "", confirmPassword: "", username: "" });
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
    if (!formData.username) errors.username = "Username is required.";
    if (!formData.password) errors.password = "Password is required.";
    if (!formData.confirmPassword)
      errors.confirmPassword = "Confirm password is required.";
    if (!isValidEmail()) errors.email = "Invalid email.";
    if (formData.password !== formData.confirmPassword) {
      errors.password = "Password and confirm password do not match.";
      errors.confirmPassword = "Password and confirm password do not match.";
    }

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
      const response = await registerUser(formData);
    } catch (error) {
      toast({
        title: `Error occured`,
        description: `No such user exists. Kindly recheck your credentials.`,
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
    console.log("up");
    resetFormData();
  }, []);

  return (
    <Box padding={2}>
      <Heading>Register</Heading>
      <VStack marginY={8} marginTop={3} gap={3}>
        <FormControl id="register-email" isRequired isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <InputGroup size={"md"}>
            <Input
              name="email"
              placeholder="Enter Your Email Address"
              onChange={handleChange}
              value={formData.email}
            />
          </InputGroup>
          {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
        </FormControl>
        <FormControl id="register-username" isRequired isInvalid={errors.email}>
          <FormLabel>Username</FormLabel>
          <InputGroup size={"md"}>
            <Input
              name="username"
              placeholder="Enter Preferred Username"
              onChange={handleChange}
              value={formData.username}
            />
          </InputGroup>
          {errors.email && (
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          id="register-password"
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
        <FormControl
          id="register-confirm-password"
          isRequired
          isInvalid={errors.password}
        >
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size={"md"}>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter Your Password"
              name="confirmPassword"
              onChange={handleChange}
              value={formData.confirmPassword}
            />
            <InputRightElement w={"3.5rem"}>
              <Button
                bgColor={"inherit !important"}
                h={"1.75rem"}
                size={"sm"}
                onClick={(e) => setShowConfirmPassword((show) => !show)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          isLoading={loading}
          colorScheme="blue"
          w={"100%"}
          marginTop={"15px"}
          onClick={handleSubmit}
        >
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default SignUp;
