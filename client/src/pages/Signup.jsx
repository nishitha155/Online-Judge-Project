import React, { useState } from 'react';
import { 
  Flex, Box, Image, Text, Input, Button, IconButton, Stack, HStack, VStack,
  FormControl, FormLabel, FormErrorMessage, useToast 
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import signupImage from './signup-background.jpg';
import logo from '../assets/image.png';
axios.defaults.baseURL = 'http://localhost:2000';
export const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters long';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'phoneNumber':
        if (!/^[6-9]\d{9}$/.test(value)) {
          error = 'Invalid Indian phone number';
        }
        break;
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
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match';
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

    if (name === 'userName' || name === 'email') {
      checkUniqueness(name, value);
    }
  };

  const checkUniqueness = async (field, value) => {
    try {
      const response = await axios.post('/check-uniqueness', { [field]: value });
      if (!response.data.isUnique) {
        setErrors({ ...errors, [field]: `This ${field} is already taken` });
        if (field === 'userName') {
          setFormData({ ...formData, userName: '' });
        }
        toast({
          title: `${field} is not unique`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error checking uniqueness:', error);
    }
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
      const response = await axios.post('/register', formData);
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Handle successful registration (e.g., redirect to login page or dashboard)
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.response?.data?.message || 'An error occurred during registration.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
                <Stack spacing={5}>
                  <HStack spacing={50} alignItems="flex-start">
                    <FormControl isInvalid={!!errors.fullName}>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        variant="filled"
                        placeholder="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        variant="filled"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                  </HStack>
                  <HStack spacing={50} alignItems="flex-start">
                    <FormControl isInvalid={!!errors.phoneNumber}>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        variant="filled"
                        placeholder="Phone"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.userName}>
                      <FormLabel>Username</FormLabel>
                      <Input
                        variant="filled"
                        placeholder="Username"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.userName}</FormErrorMessage>
                    </FormControl>
                  </HStack>
                  <HStack spacing={50} alignItems="flex-start">
                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel>Password</FormLabel>
                      <Input
                        variant="filled"
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.confirmPassword}>
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        variant="filled"
                        placeholder="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                    </FormControl>
                  </HStack>
                  <VStack>
                    <Text mb={2}>Or sign up with</Text>
                    <HStack spacing={4}>
                      <IconButton aria-label="Google" icon={<FcGoogle fontSize="24px" />} />
                      <IconButton aria-label="GitHub" icon={<FaGithub fontSize="24px" />} />
                      <IconButton aria-label="LinkedIn" icon={<FaLinkedin fontSize="24px" />} />
                    </HStack>
                  </VStack>

                  <Flex justify="center">
                    <Button colorScheme="teal" size="lg" width="50%" type="submit" isLoading={isSubmitting}>
                      Sign Up
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Box>
            <Box w="30%" backgroundImage={`url(${signupImage})`} backgroundSize="cover" backgroundPosition="center" position="relative">
              <Box position="absolute" bottom="60" left="50%" transform="translateX(-50%)" textAlign="center" color="white">
                <Text fontSize="3xl" fontWeight="bold">Already have an account?</Text>
                <Text mt={2}>Login and start solving problems</Text>
                <Button mt={4} colorScheme="whiteAlpha" variant="outline">Login</Button>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <ToastContainer />
    </>
  );
};