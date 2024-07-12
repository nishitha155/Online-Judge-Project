import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, CheckIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Cookies from 'js-cookie';

const authToken = Cookies.get('authToken');

const ContestTable = ({ contests, isPast, isCurrent, onRegister, onParticipate }) => {
  const navigate = useNavigate();

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Title</Th>
          <Th>Date</Th>
          <Th>Duration</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {contests.map((contest) => (
          <Tr key={contest._id}>
            <Td>{contest.contestName}</Td>
            <Td>{new Date(contest.startTime).toLocaleString()}</Td>
            <Td>{contest.duration} mins</Td>
            <Td>
              {isPast ? (
                <Button size="sm" leftIcon={<CheckIcon />}>
                  View Results
                </Button>
              ) : isCurrent ? (
                contest.isRegistered ? (
                  <Button 
                    size="sm" 
                    leftIcon={<TimeIcon />}
                    onClick={() => onParticipate(contest._id)}
                  >
                    Attempt
                  </Button>
                ) : (
                  <Text color="red.500">Not Registered</Text>
                )
              ) : (
                <Button 
                  size="sm" 
                  leftIcon={<CalendarIcon />} 
                  onClick={() => onRegister(contest._id)}
                  isDisabled={contest.isRegistered}
                >
                  {contest.isRegistered ? 'Registered' : 'Register'}
                </Button>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const Contest = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [currentContests, setCurrentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await fetch('http://localhost:2000/contests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contests');
      }
      const data = await response.json();

      const now = new Date();
      const upcoming = [];
      const current = [];
      const past = [];

      data.forEach((contest) => {
        const startTime = new Date(contest.startTime);
        const endTime = new Date(startTime.getTime() + contest.duration * 60000);

        if (startTime > now) {
          upcoming.push(contest);
        } else if (startTime <= now && endTime > now) {
          current.push(contest);
        } else {
          past.push(contest);
        }
      });

      setUpcomingContests(upcoming);
      setCurrentContests(current);
      setPastContests(past);

      // Log registration status for current contests
      current.forEach(contest => {
        console.log(`Current contest ${contest._id}: User is ${contest.isRegistered ? 'registered' : 'not registered'}`);
      });
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch contests',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRegister = async (contestId) => {
    try {
      const response = await fetch('http://localhost:2000/registercontest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ contestId }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      toast({
        title: 'Success',
        description: 'You have been registered for the contest',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setUpcomingContests(prevContests =>
        prevContests.map(contest =>
          contest._id === contestId ? { ...contest, isRegistered: true } : contest
        )
      );
    } catch (error) {
      console.error('Error registering for contest:', error);
      toast({
        title: 'Error',
        description: 'Failed to register for the contest',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleParticipate = (contestId) => {
    navigate(`/contest/${contestId}`);
  };

  return (
    <>
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Current Contests
            </Heading>
            <ContestTable 
              contests={currentContests} 
              isPast={false} 
              isCurrent={true} 
              onParticipate={handleParticipate}
            />
          </Box>
          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Upcoming Contests
            </Heading>
            <ContestTable 
              contests={upcomingContests} 
              isPast={false} 
              isCurrent={false} 
              onRegister={handleRegister}
            />
          </Box>
          <Box>
            <Heading as="h2" size="xl" mb={4}>
              Past Contests
            </Heading>
            {pastContests.length > 0 ? (
              <ContestTable contests={pastContests} isPast={true} isCurrent={false} />
            ) : (
              <Text>No past contests</Text>
            )}
          </Box>
        </VStack>
      </Container>
    </>
  );
};