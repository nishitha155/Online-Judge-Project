import React from 'react';
import {
  Box, Heading, SimpleGrid, Image, Button, Table, Thead, Tbody, Tr, Th, Td,
  VStack, Text, Container, useColorModeValue, Flex, HStack
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Navbar from '../Components/Navbar';
import { LockIcon } from '@chakra-ui/icons';
// Import your images
import interviewImage from '../assets/back1.jpg';
import dpImage from '../assets/back9.jpg';
import amazonImage from '../assets/back3.jpg';
import amazon from '../assets/back7.jpg';
import googleImage from '../assets/back4.jpg';
import google from '../assets/back8.webp';
import top150 from '../assets/back5.jpg';
import dp from '../assets/back6.png';

export const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

  const handleStartSolving = (plan) => {
    toast.info(`Starting ${plan}`);
  };

  const handleRegister = (contest) => {
    toast.success(`Registered for ${contest}`);
  };

  const handleUnlock = (assignment) => {
    toast.info(`Unlocking ${assignment}`);
  };

  return (
    <>
      <Navbar/>
    
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW="container.xl">
          <Heading textAlign="center" mb={8} fontSize="3xl" fontWeight="bold">
            Featured Plans
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={12}>
            {[
              { title: 'Top 150 Interview Questions', image: top150 },
              { title: 'Master Dynamic Programming', image: dp },
              { title: "Amazon's Most Frequent Questions", image: amazon },
              { title: "Google's Most Frequent Questions", image: google },
            ].map((plan, index) => (
              <Box
                key={index}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                bg={boxBgColor}
              >
                <Flex p={4}>
                  <Image src={plan.image} alt={plan.title} boxSize="80px" objectFit="cover" mr={4} />
                  <VStack align="stretch" spacing={3} flex={1}>
                    <Text fontWeight="bold" fontSize="lg">{plan.title}</Text>
                    <Button colorScheme="teal" onClick={() => handleStartSolving(plan.title)}>
                      Start Solving
                    </Button>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>

          <Heading textAlign="center" mb={6} fontSize="2xl">
            Upcoming Contests
          </Heading>

          <Box overflowX="auto" mb={6}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Contest Name</Th>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Register</Th>
                </Tr>
              </Thead>
              <Tbody>
                {[
                  { name: 'Weekly Contest 1', date: '2023-07-01', time: '20:00 UTC' },
                  { name: 'Biweekly Contest 1', date: '2023-07-08', time: '14:00 UTC' },
                  { name: 'Special Contest', date: '2023-07-15', time: '18:00 UTC' },
                ].map((contest, index) => (
                  <Tr key={index}>
                    <Td>{contest.name}</Td>
                    <Td>{contest.date}</Td>
                    <Td>{contest.time}</Td>
                    <Td>
                      <Button 
                        size="sm" 
                        colorScheme="green" 
                        onClick={() => handleRegister(contest.name)}
                        _hover={{ bg: 'green.600' }}
                      >
                        Register
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box textAlign="center" mb={12}>
            <Button colorScheme="blue">View All</Button>
          </Box>

          <Heading textAlign="center" mb={6} fontSize="2xl">
            Assignments
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            {[
              { name: 'Assignment 1', streak: 7, image: interviewImage },
              { name: 'Assignment 2', streak: 14, image: dpImage },
              { name: 'Assignment 3', streak: 21, image: amazonImage },
            ].map((assignment, index) => (
              <Box
                key={index}
                borderRadius="lg"
                p={6}
                boxShadow="md"
                bg={boxBgColor}
                textAlign="center"
                backgroundImage={`url(${assignment.image})`}
                backgroundSize="cover"
                backgroundPosition="center"
              >
                <Heading size="md" mb={4}>{assignment.name}</Heading>
                <Text mb={4}>Unlock by maintaining a continuous streak of {assignment.streak}</Text>
                <Button 
                  colorScheme="green" 
                  onClick={() => handleUnlock(assignment.name)}
                  leftIcon={<LockIcon />}
                >
                  Unlock Now
                </Button>
              </Box>
            ))}
          </SimpleGrid>

          <Box textAlign="center">
            <Button colorScheme="blue">View All Offers</Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};