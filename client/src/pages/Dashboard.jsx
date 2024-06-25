import  React,{ useState,useEffect } from 'react';
import {
  Box, Container, VStack, Text, Button, Avatar, Heading, 
  Table, Thead, Tbody, Tr, Th, Td, useColorModeValue, SimpleGrid, 
  CircularProgress, CircularProgressLabel, Stat, StatLabel, StatNumber,
  Grid, GridItem, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalFooter, ModalBody, ModalCloseButton, Input, useDisclosure,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay,
} from '@chakra-ui/react';
import {  ChevronRightIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Navbar from '../Components/Navbar';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


ChartJS.register(ArcElement, Tooltip, Legend);




const getRandomValue = () => Math.floor(Math.random() * 5);

const calendarData = [...Array(365)].map((_, index) => ({
  date: new Date(2023, 0, index + 1),
  count: getRandomValue(),
}));

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

  const authToken = Cookies.get('authToken');
  console.log(authToken)
  

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

  useEffect(() => {
    
    if (authToken) {
      getUserDetails();
    }
  }, [authToken]);


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
                <VStack spacing={2}>
                  <Heading size="lg">{user.fullName}</Heading>
                  <Text fontSize="md" color="gray.500">@{user.userName}</Text>
                </VStack>
                <VStack spacing={3} width="100%">
                <Link to="/update">
                  <Button colorScheme="blue"  width="100%">Update Profile</Button>
                  </Link>
                  <Link to="/password">
                  <Button colorScheme="green"  width="100%">Change Password</Button>
                  </Link>
                  <Button colorScheme="red"  width="100%">Logout</Button>
                  <Button colorScheme="gray"  width="100%" onClick={onOpen}>Delete Account</Button>
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
            <ModalFooter><Button colorScheme="blue" mr={3} onClick={onClose}>
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
                <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
                  <Stat>
                    <StatLabel>Total Solved</StatLabel>
                    <StatNumber>112</StatNumber>
                    <Text fontSize="sm" color="gray.500">out of 3193</Text>
                  </Stat>
                  <Box>
                    <CircularProgress value={60} size="100px" thickness="12px" color="cyan.400">
                      <CircularProgressLabel>60</CircularProgressLabel>
                    </CircularProgress>
                    <Text mt={2} fontWeight="bold">Easy</Text>
                  </Box>
                  <Box>
                    <CircularProgress value={51} size="100px" thickness="12px" color="orange.400">
                      <CircularProgressLabel>51</CircularProgressLabel>
                    </CircularProgress>
                    <Text mt={2} fontWeight="bold">Medium</Text>
                  </Box>
                  <Box>
                    <CircularProgress value={1} size="100px" thickness="12px" color="red.400">
                      <CircularProgressLabel>1</CircularProgressLabel>
                    </CircularProgress>
                    <Text mt={2} fontWeight="bold">Hard</Text>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Coding Streak Calendar */}
              <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md" width="100%">
                <Heading size="md" mb={4}>Coding Streak</Heading>
                <CalendarHeatmap
                  startDate={new Date(year, 0, 1)}
                  endDate={new Date(year, 11, 31)}
                  values={calendarData}
                  classForValue={(value) => {
                    if (!value) {
                      return 'color-empty';
                    }
                    return `color-scale-${value.count}`;
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
    </>
  );
};