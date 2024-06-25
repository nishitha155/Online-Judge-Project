import { useState,useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Container,
} from '@chakra-ui/react';
import Header from '../Components/Header';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


export const Verification = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const { username } = location.state || {};
  console.log(username);
  const navigate=useNavigate();
  
  useEffect(() => {
    if (username) {
      console.log('Username from signup:', username);
    }
  }, [username]);


  const handleVerify = async () => {
    if (otp.length === 4) {
      try {
        const response = await axios.post('/verify-email', { username, otp });
        Cookies.set('authToken', response.data.token);
        toast.success(response.data.message);
        navigate('/home');
      } catch (error) {
        toast.error(error.response.data.message || 'Verification failed');
      }
    } else {
      toast.error('Please enter a 4-digit OTP');
    }
  };

  return (
    <>
      <Header />
      <Container maxW="100vw" h="90vh" centerContent>
        <VStack
          spacing={8}
          justify="center"
          align="center"
          h="100%"
          w={['90%', '80%', '60%', '40%']}
        >
          <Box
            p={8}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            w="100%"
            textAlign="center"
            backgroundColor="white"
          >
            <Heading mb={6}>Email Verification</Heading>
            <Text mb={6}>
              An email has been sent to you. Please check your inbox and enter the OTP below.
            </Text>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              mb={4}
              textAlign="center"
              letterSpacing="0.5em"
              maxLength={4}
            />
            <Button colorScheme="teal" onClick={handleVerify} w="100%">
              Verify
            </Button>
          </Box>
        </VStack>
      </Container>
      <ToastContainer />
    </>
  );
};
