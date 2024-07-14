import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Container,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasExistingPassword, setHasExistingPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    const checkExistingPassword = async () => {
      try {
        const response = await fetch('https://algobug.onrender.com/check-password', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setHasExistingPassword(data.hasPassword);
      } catch (error) {
        console.error('Error checking existing password:', error);
        toast.error('Failed to check existing password');
      }
    };

    checkExistingPassword();
  }, [authToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://algobug.onrender.com/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword: hasExistingPassword ? currentPassword : undefined,
          newPassword,
        }),
      });

      const data = await response.json();
      
      Cookies.remove('authToken'); // Clear the existing cookie
      Cookies.set('authToken', data.token, { expires: 0.24 });

      if (response.ok) {
        toast.success('Password changed successfully');
        Cookies.remove('authToken');
        Cookies.set('authToken', data.token);
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An error occurred while changing the password');
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="xl">
        <VStack spacing={6} align="stretch">
          <Heading size="xl" textAlign="center">
            Change Password
          </Heading>
          {!hasExistingPassword && (
            <Alert status="info">
              <AlertIcon />
              You have not set a password yet. Please create a new password.
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {hasExistingPassword && (
                <FormControl isRequired>
                  <FormLabel>Current Password</FormLabel>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                isLoading={isLoading}
              >
                Change Password
              </Button>
            </VStack>
          </form>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Password must be at least 6 characters long.
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default ChangePassword;