import React from 'react';
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
  useColorModeValue,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, CheckIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import Navbar from '../Components/Navbar';

const upcomingContests = [
  { id: 1, name: 'Weekly Challenge', date: '2024-07-01', time: '20:00 IST', registered: 1245 },
  { id: 2, name: 'Algorithms Marathon', date: '2024-07-15', time: '18:00 IST', registered: 987 },
  { id: 3, name: 'Data Structures Bonanza', date: '2024-07-22', time: '19:00 IST', registered: 1532 },
  { id: 4, name: 'Coding Sprint', date: '2024-08-05', time: '21:00 IST', registered: 756 },
];

const pastContests = [
  { id: 1, name: 'June Coding Challenge', date: '2024-06-15', time: '19:00 IST', participants: 2341 },
  { id: 2, name: 'Spring Algorithms Contest', date: '2024-05-20', time: '18:30 IST', participants: 1876 },
  { id: 3, name: 'Data Structures Showdown', date: '2024-04-10', time: '20:00 IST', participants: 2103 },
  { id: 4, name: 'March Madness Coding', date: '2024-03-15', time: '19:30 IST', participants: 1654 },
];

const ContestTable = ({ contests, isPast }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleRegister = (contestName) => {
    toast.success(`Registered for ${contestName}`);
  };

  const handleViewResults = (contestName) => {
    toast.info(`Viewing results for ${contestName}`);
  };

  return (
    
    <Box overflowX="auto" bg={bgColor} borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Contest Name</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>{isPast ? 'Participants' : 'Registered'}</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contests.map((contest) => (
            <Tr key={contest.id}>
              <Td fontWeight="medium">{contest.name}</Td>
              <Td>
                <HStack>
                  <CalendarIcon color="blue.500" />
                  <Text>{contest.date}</Text>
                </HStack>
              </Td>
              <Td>
                <HStack>
                  <TimeIcon color="green.500" />
                  <Text>{contest.time}</Text>
                </HStack>
              </Td>
              <Td>
                <Badge colorScheme={isPast ? 'purple' : 'teal'} borderRadius="full" px={2}>
                  {isPast ? contest.participants : contest.registered}
                </Badge>
              </Td>
              <Td>
                {isPast ? (
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleViewResults(contest.name)}
                    leftIcon={<CheckIcon />}
                  >
                    Results
                  </Button>
                ) : (
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => handleRegister(contest.name)}
                  >
                    Register
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    
  );
};

export const Contests = () => {
  return (
    <>
        <Navbar/>
    
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Upcoming Contests
          </Heading>
          <ContestTable contests={upcomingContests} isPast={false} />
        </Box>
        <Box>
          <Heading as="h2" size="xl" mb={4}>
            Past Contests
          </Heading>
          <ContestTable contests={pastContests} isPast={true} />
        </Box>
      </VStack>
    </Container>
    </>
  );
};