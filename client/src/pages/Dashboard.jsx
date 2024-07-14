import React, { useState, useEffect } from 'react';
import {
  Box, Container, VStack, Text, Button, Avatar, Heading, 
  Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, SimpleGrid, 
  CircularProgress, CircularProgressLabel, Stat, StatLabel, StatNumber,
  Grid, GridItem, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalFooter, ModalBody, ModalCloseButton, Input, useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Navbar from '../Components/Navbar';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const pastContests = [
  { name: 'Weekly Contest 300', date: '2024-06-15', time: '20:00 UTC', rank: 245 },
  { name: 'Biweekly Contest 150', date: '2024-06-01', time: '14:00 UTC', rank: 189 },
  { name: 'Weekly Contest 299', date: '2024-05-22', time: '20:00 UTC', rank: 312 },
  { name: 'Weekly Contest 298', date: '2024-05-15', time: '20:00 UTC', rank: 278 },
  { name: 'Biweekly Contest 149', date: '2024-05-08', time: '14:00 UTC', rank: 201 },
];

const submissions = [
  { title: 'Two Sum', date: '2024-06-20', status: 'Accepted' },
  { title: 'Reverse Linked List', date: '2024-06-19', status: 'Time Limit Exceeded' },
  { title: 'Binary Tree Inorder Traversal', date: '2024-06-18', status: 'Accepted' },
  { title: 'Merge Two Sorted Lists', date: '2024-06-17', status: 'Wrong Answer' },
  { title: 'Valid Parentheses', date: '2024-06-16', status: 'Accepted' },
];

export const Dashboard = () => {
  const [user, setUser] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const bgColor = useColorModeValue('white', 'gray.800');
  const [username, setUsername] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const [problemStats, setProblemStats] = useState(null);
  const [submissionData, setSubmissionData] = useState([]);

  const authToken = Cookies.get('authToken');

  async function getUserDetails() {
    try {
      const response = await fetch('http://localhost:2000/userdetails', {
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
      
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      toast.error(`Failed to fetch user details: ${error.message}`);
    }
  }

  const handleLogout = () => {
    Cookies.remove('authToken');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (username === user.userName) {
      try {
        const response = await fetch('http://localhost:2000/deleteaccount', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to delete account');
        }

        Cookies.remove('authToken');
        toast.success('Account deleted successfully');
        navigate('/user/signup');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    } else {
      toast.error('Username does not match');
    }
  };

  const getProblemStats = async () => {
    try {
      const response = await fetch('http://localhost:2000/problem-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch problem stats');
      }

      const stats = await response.json();
      setProblemStats(stats);
    } catch (error) {
      console.error('Error fetching problem stats:', error);
      toast.error('Failed to fetch problem stats');
    }
  };

  const getSubmissionData = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/user-submissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submission data');
      }

      const data = await response.json();
      const formattedData = Object.entries(data).map(([date, count]) => ({ date, count }));
      setSubmissionData(formattedData);
    } catch (error) {
      console.error('Error fetching submission data:', error);
      toast.error('Failed to fetch submission data');
    }
  };

  useEffect(() => {
    if (authToken) {
      getUserDetails();
      getProblemStats();
      getSubmissionData();
    }
  }, [authToken]);

  return (
    <>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", md: "30% 70%" }} gap={8}>
          {/* 30% Column */}
          <GridItem>
            <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
              <VStack spacing={6} align="center">
                <Avatar name={user.fullName} size="2xl" />
                <VStack spacing={2} align="center">
                  <Heading size="lg" textAlign="center">{user.fullName}</Heading>
                  <Text fontSize="md" color="gray.500">@{user.userName}</Text>
                </VStack>
                <VStack spacing={3} width="100%">
                  <Link to="/update" style={{ width: '100%' }}>
                    <Button colorScheme="blue" width="100%">Update Profile</Button>
                  </Link>
                  <Link to="/password" style={{ width: '100%' }}>
                    <Button colorScheme="green" width="100%">Change Password</Button>
                  </Link>
                  <Button colorScheme="red" width="100%" onClick={handleLogout}>Logout</Button>
                  <Button colorScheme="gray" width="100%" onClick={onOpen}>Delete Account</Button>
                </VStack>
              </VStack>
            </Box>
          </GridItem>

          {/* 70% Column */}
          <GridItem>
            <VStack spacing={8}>
              {/* Problem Solving Stats */}
              <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" width="100%">
                <Heading size="md" mb={4}>Problem Solving Stats</Heading>
                {problemStats ? (
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
                    <Stat>
                      <StatLabel>Total Solved</StatLabel>
                      <StatNumber>{problemStats.acceptedProblems}</StatNumber>
                      <Text fontSize="sm" color="gray.500">out of {problemStats.totalProblems}</Text>
                    </Stat>
                    {problemStats.difficultyStats.map(stat => (
                      <Box key={stat.difficulty}>
                        <CircularProgress
                          value={stat.accepted / stat.total * 100}
                          size="100px"
                          thickness="12px"
                          color={stat.difficulty === 'Easy' ? "cyan.400" : (stat.difficulty === 'Medium' ? "orange.400" : "red.400")}
                        >
                          <CircularProgressLabel>{stat.accepted}</CircularProgressLabel>
                        </CircularProgress>
                        <Text mt={2} fontWeight="bold">{stat.difficulty}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text>Loading problem stats...</Text>
                )}
              </Box>

              {/* Coding Streak Calendar */}
              <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" width="100%">
                <Heading size="md" mb={4}>Coding Streak</Heading>
                <CalendarHeatmap
                  startDate={new Date(year, 0, 1)}
                  endDate={new Date(year, 11, 31)}
                  values={submissionData}
                  classForValue={(value) => {
                    if (!value) {
                      return 'color-empty';
                    }
                    return `color-scale-${Math.min(value.count, 4)}`;
                  }}
                />
                <style jsx global>{`
                  .react-calendar-heatmap .color-scale-1 { fill: #d6e685; }
                  .react-calendar-heatmap .color-scale-2 { fill: #8cc665; }
                  .react-calendar-heatmap .color-scale-3 { fill: #44a340; }
                  .react-calendar-heatmap .color-scale-4 { fill: #1e6823; }
                `}</style>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        {/* Past Contests and Submissions */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mt={8}>
          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>Past Contests</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Contest</Th>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Rank</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pastContests.map((contest, index) => (
                  <Tr key={index}>
                    <Td>{contest.name}</Td>
                    <Td>{contest.date}</Td>
                    <Td>{contest.time}</Td>
                    <Td>{contest.rank}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button rightIcon={<ChevronRightIcon />} colorScheme="blue" variant="link" mt={2}>
              View More
            </Button>
          </Box>
          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>Previous Submissions</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Problem</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {submissions.map((submission, index) => (
                  <Tr key={index}>
                    <Td>{submission.title}</Td>
                    <Td>{submission.date}</Td>
                    <Td>
                      <Text color={submission.status === 'Accepted' ? 'green.500' : 'red.500'}>
                        {submission.status}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button rightIcon={<ChevronRightIcon />} colorScheme="blue" variant="link" mt={2}>
              View More
            </Button>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Delete Account Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Please enter your username to confirm account deletion:</Text>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onClose();
                setIsAlertOpen(true);
              }}
              isDisabled={username !== user.userName}
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Confirmation Alert */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Dashboard;