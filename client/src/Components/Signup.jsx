import React, { useState } from 'react';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  useColorModeValue,
  Icon,
  HStack,
  Link,
  Spacer,
  Tooltip,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook, FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { BsGithub, BsDiscord } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform signup logic here
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      toast.success('Signup successful!');
      // Reset form data
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Container
        maxW={'7xl'}
        py={12}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
      >
        <Flex h={'100%'} align={'center'} justify={'space-between'}>
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <HStack spacing={2}>
                <Avatar
                  bg={'blue.500'}
                  color={'white'}
                  size={'lg'}
                  icon={<Icon as={BsGithub} boxSize={8} />}
                />
                <Heading fontSize={'4xl'} color={'blue.500'}>
                  Company Name
                </Heading>
              </HStack>
              <Text fontSize={'lg'} color={'gray.600'}>
                Join our community!
              </Text>
            </Stack>
            <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <SimpleGrid columns={2} spacing={4}>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="Name"
                    />
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="Email"
                    />
                  </SimpleGrid>
                  <SimpleGrid columns={2} spacing={4}>
                    <Input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Password"
                    />
                    <Input
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </SimpleGrid>
                  <Stack spacing={10}>
                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}
                      type="submit"
                    >
                      Sign Up
                    </Button>
                    <HStack spacing={2}>
                      <Text>Already have an account?</Text>
                      <Link
                        color={'blue.400'}
                        onClick={() => navigate('/login')}
                        style={{ cursor: 'pointer' }}
                      >
                        Log In
                      </Link>
                    </HStack>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
          <Box w="30%">
            <Box
              bgImage="url('https://via.placeholder.com/350')"
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="cover"
              h="100%"
              position="relative"
            >
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                textAlign="center"
                color="white"
              >
                <Text fontSize="2xl" fontWeight="bold">
                  Already have an account?
                </Text>
                <Button
                  mt={4}
                  colorScheme="blue"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
      <ToastContainer />
    </Flex>
  );
};

export default Signup;