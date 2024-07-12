import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContestAttempt = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await fetch(`http://localhost:2000/contests/${contestId}`);
        if (!response.ok) throw new Error('Failed to fetch contest details');
        const data = await response.json();
        setContest(data);
        toast.success('Contest details loaded successfully');
      } catch (error) {
        console.error('Error fetching contest details:', error);
        toast.error('Failed to load contest details');
      }
    };

    fetchContestDetails();
  }, [contestId]);

  useEffect(() => {
    if (contest) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(contest.startTime).getTime() + contest.duration * 60000;
        const difference = endTime - now;

        if (difference > 0) {
          setTimeLeft({
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        } else {
          clearInterval(timer);
          onOpen();
          toast.info('Contest has ended');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [contest, onOpen]);

  const handleSolveProblem = (problem) => {
    navigate(`/contest/${contestId}/problem/${problem._id}`, { state: { timeLeft, contest } });
  };

  if (!contest) return <Text>Loading...</Text>;

  return (
    <Container maxW="container.xl" py={8}>
      <ToastContainer />
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={2}>
            {contest.contestName}
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Start Time: {new Date(contest.startTime).toLocaleString()}
          </Text>
        </Box>

        <HStack justifyContent="center" spacing={4}>
          {['hours', 'minutes', 'seconds'].map((unit) => (
            <Box key={unit} bg={bgColor} borderRadius="md" p={4} minW="100px" textAlign="center">
              <Text fontSize="3xl" fontWeight="bold">
                {timeLeft[unit]}
              </Text>
              <Text fontSize="sm" textTransform="uppercase">
                {unit}
              </Text>
            </Box>
          ))}
        </HStack>

        <Box bg={bgColor} borderRadius="md" p={6}>
          <Heading as="h2" size="lg" mb={4}>
            Rules
          </Heading>
          <Text>{contest.rules}</Text>
        </Box>

        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
          {contest.problems.map((problem, index) => (
            <Box key={index} bg={cardBgColor} borderRadius="md" p={6} boxShadow="md">
              <Heading as="h3" size="md" mb={4}>
                {problem.title}
              </Heading>
              <Button colorScheme="blue" onClick={() => handleSolveProblem(problem)}>
                Solve
              </Button>
            </Box>
          ))}
        </Grid>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contest Ended</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>The contest has ended. Thank you for participating!</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ContestAttempt;