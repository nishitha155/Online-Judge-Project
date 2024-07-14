import  { useState } from 'react';
import { 
  Flex, Box, Image, Text, Input, Button,  Stack, 
  FormControl, FormLabel, FormErrorMessage, useToast 
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Components/Header';
import signupImage from './signup-background.jpg';
import logo from '../assets/image.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
axios.defaults.baseURL = 'http://localhost:2000';
export const Signup = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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
      navigate('/home',);
      
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

  // const loginwithgoogle=()=>{
  //   window.open("http://localhost:2000/auth/google/callback", "_self");
  // }

  return (
    <>
    <Header />
      <Flex h="90vh" align="center" justify="center">
        <Box w="100%" bg="white" boxShadow="xl" rounded="lg" overflow="hidden">
          <Flex h="90vh">
            <Box w="70%" p={8}>
              <Flex justify="center" mb={6}>
                <Image src={logo} alt="Logo" boxSize="60px" borderRadius="full" />
                <Text fontSize="3xl" fontWeight="bold" ml={3} color="teal.500">
                  AlgoBug
                </Text>
              </Flex>
              <form onSubmit={handleSubmit}>
                <Stack spacing={1} align="center">
                  <FormControl isInvalid={!!errors.fullName} width="350px">
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
                  <FormControl isInvalid={!!errors.email} width="350px">
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
                  <FormControl isInvalid={!!errors.userName} width="350px">
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
                  <FormControl isInvalid={!!errors.password} width="350px">
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
                  <FormControl isInvalid={!!errors.confirmPassword} width="350px">
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
                  {/* <Box textAlign="center" mt={4}>
                    <Text mb={2}>Or sign up with</Text>
                    <Button leftIcon={<FcGoogle fontSize="24px" />} variant="outline" onClick={loginwithgoogle}>
                      Sign up with Google
                    </Button>
                  </Box> */}

                  <Flex justify="center">
                    <Button colorScheme="teal" size="lg" width="70%" type="submit" isLoading={isSubmitting}>
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
                <Link to="/user/login">
                <Button mt={4} colorScheme="whiteAlpha" variant="outline">Login</Button>
                </Link>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <ToastContainer />
    </>
  );
};
