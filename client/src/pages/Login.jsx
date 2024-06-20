import React, { useState, useEffect } from 'react';
import {
  Flex, Box, Image, Text, Input, Button, VStack,HStack,
  FormControl, FormLabel, FormErrorMessage, useToast,IconButton
} from '@chakra-ui/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import signupImage from './signup-background.jpg';
import logo from '../assets/logo.png';

axios.defaults.baseURL = 'http://localhost:3000';

export const Login = () => {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'userName':
        if (!/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
          error = 'Username must be at least 8 characters with one capital letter and one digit';
        }
        break;
      case 'password':
        if (value.length < 6) {
          error = 'Password must be at least 6 characters long';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/login', formData);
      toast({
        title: 'Login successful',
        description: "You've been successfully logged in.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Handle successful login (e.g., redirect to dashboard)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrors({ ...errors, userName: 'Username does not exist' });
      } else {
        toast({
          title: 'Login failed',
          description: error.response?.data?.message || 'An error occurred during login.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Flex h="90vh" align="center" justify="center">
        <Box w="100%" bg="white" boxShadow="xl" rounded="lg" overflow="hidden">
          <Flex h="87vh">
            <Box w="70%" p={8}>
              <Flex justify="center" mb={6}>
                <Image src={logo} alt="Logo" boxSize="50px" />
                <Text fontSize="3xl" fontWeight="bold" ml={3}>
                  Algobug
                </Text>
              </Flex>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch" maxWidth="400px" mx="auto">
                  <FormControl isInvalid={!!errors.userName}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.userName}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button
                    colorScheme="teal"
                    width="full"
                    mt={4}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Login
                  </Button>
                </VStack>
                <VStack>
                    <Text mb={2}>Or sign up with</Text>
                    <HStack spacing={4}>
                      <IconButton aria-label="Google" icon={<FcGoogle fontSize="24px" />} />
                      <IconButton aria-label="GitHub" icon={<FaGithub fontSize="24px" />} />
                      <IconButton aria-label="LinkedIn" icon={<FaLinkedin fontSize="24px" />} />
                    </HStack>
                  </VStack>
              </form>
            </Box>
            <Box w="30%" backgroundImage={`url(${signupImage})`} backgroundSize="cover" backgroundPosition="center" position="relative">
              <Box position="absolute" bottom="60" left="50%" transform="translateX(-50%)" textAlign="center" color="white">
                <Text fontSize="3xl" fontWeight="bold">New Here?</Text>
                <Text mt={2}>Signup and discover great opportunities</Text>
                <Button mt={4} colorScheme="whiteAlpha" variant="outline">Signup</Button>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <ToastContainer />
    </>
  );
};