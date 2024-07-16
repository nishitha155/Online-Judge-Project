import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Heading, SimpleGrid, Image, Button, Table, Thead, Tbody, Tr, Th, Td,
  VStack, Text, Container, useColorModeValue, Flex, HStack
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Header1 from '../Components/Header1';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../Components/Footer';

// Import your images
import interviewImage from '../assets/back1.jpg';
import dpImage from '../assets/back9.jpg';
import amazonImage from '../assets/back3.jpg';
import amazon from '../assets/back7.jpg';
import googleImage from '../assets/back4.jpg';
import google from '../assets/back8.webp';
import top150 from '../assets/back5.jpg';
import dp from '../assets/back6.png';

export const HomeBeforeLogin = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingContests = async () => {
      try {
        const response = await axios.get('https://algobug.onrender.com/upcoming');
        setUpcomingContests(response.data);
      } catch (error) {
        console.error('Error fetching upcoming contests:', error);
        toast.error('Failed to fetch upcoming contests');
      }
    };

    fetchUpcomingContests();
  }, []);

  const handleLogin = () => {
    navigate('/user/login');
  };

 

  return (
    <>
      <Header1 />
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
                onClick={handleLogin}
                bg={boxBgColor}
              >
                <Flex p={4}>
                  <Image src={plan.image} alt={plan.title} boxSize="80px" objectFit="cover" mr={4} />
                  <VStack align="stretch" spacing={3} flex={1}>
                    <Text fontWeight="bold" fontSize="lg">{plan.title}</Text>
                    <Button colorScheme="teal">
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
                  <Th>Duration</Th>
                </Tr>
              </Thead>
              <Tbody>
                {upcomingContests.map((contest, index) => (
                  <Tr key={index}>
                    <Td>{contest.contestName}</Td>
                    <Td>{new Date(contest.startTime).toLocaleDateString()}</Td>
                    <Td>{new Date(contest.startTime).toLocaleTimeString()}</Td>
                    <Td>{contest.duration} minutes</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box textAlign="center" mb={12}>
            <Button colorScheme="blue" onClick={handleLogin}>View All</Button>
          </Box>

          <Heading textAlign="center" mb={6} fontSize="2xl">
            Assignments
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            {[
              { name: 'Assignment 1', image: interviewImage },
              { name: 'Assignment 2', image: dpImage },
              { name: 'Assignment 3', image: amazonImage },
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
                <Button 
                  colorScheme="green" 
                  onClick={handleLogin}
                >
                  Start Solving
                </Button>
              </Box>
            ))}
          </SimpleGrid>

          <Box textAlign="center">
            <Button colorScheme="blue" onClick={handleLogin}>View All</Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};