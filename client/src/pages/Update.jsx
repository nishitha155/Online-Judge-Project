import { useState, useEffect } from 'react';
import { 
  Flex, Box, Image, Text, Input, Button, Stack, 
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
import Navbar from '../Components/Navbar';
import Cookies from 'js-cookie'


axios.defaults.baseURL = 'https://algobug.onrender.com';

export const Update = () => {
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken');
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    userName: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (authToken) {
      getUserDetails();
    }
  }, [authToken]);

  async function getUserDetails() {
    try {
      const response = await fetch('https://algobug.onrender.com/userdetails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const userDetails = await response.json();
      setUser(userDetails);
      setFormData({ fullName: userDetails.fullName, userName: userDetails.userName });
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      toast.error(`Failed to fetch user details: ${error.message}`);
    }
  }

  

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters long';
        }
        break;
      case 'userName':
        if (!/^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value)) {
          error = 'Username must be at least 8 characters with one capital letter and one digit';
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

    if (name === 'userName' ) {
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
      const response = await axios.post('/update', formData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(user),
      });
      

      const result = await response.data;
      Cookies.remove('authToken'); // Clear the existing cookie
      Cookies.set('authToken', result.token, { expires: 0.24 });
      
      toast({
        title: 'Account updated.',
        description: "Your account details have been updated.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard', { state: { username: formData.userName }});
      
    } catch (error) {
      console.log(error);
      toast({
        title: 'Update failed.',
        description: error.response?.data?.message || 'An error occurred during update.',
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
      <Navbar />
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
                  
                  <Flex justify="center">
                    <Button colorScheme="teal" size="lg" width="70%" type="submit" isLoading={isSubmitting}>
                     Update
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Box>
            <Box w="30%" backgroundImage={`url(${signupImage})`} backgroundSize="cover" backgroundPosition="center" position="relative">
              <Box position="absolute" bottom="60" left="50%" transform="translateX(-50%)" textAlign="center" color="white">
                <Text fontSize="3xl" fontWeight="bold">Want to go back to dashboard</Text>
                <Button mt={4} colorScheme="whiteAlpha" variant="outline">Click Here</Button>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <ToastContainer />
    </>
  );
};
