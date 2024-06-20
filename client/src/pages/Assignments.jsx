import React from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  Heading,
  VStack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import Navbar from '../Components/Navbar';
// Import your background images
import bg1 from '../assets/back1.jpg';
import bg2 from '../assets/back2.jpg';
import bg3 from '../assets/back3.jpg';
import bg4 from '../assets/back4.jpg';
import bg5 from '../assets/back9.jpg';

// ... import more background images as needed

const assignments = [
  { id: 1, title: 'Assignment 1', streak: 10, image: bg1 },
  { id: 2, title: 'Assignment 2', streak: 100, image: bg2 },
  { id: 3, title: 'Assignment 3', streak: 150, image: bg3 },
  { id: 4, title: 'Assignment 4', streak: 200, image: bg4 },
  { id: 5, title: 'Assignment 5', streak: 250, image: bg5 },
  { id: 6, title: 'Assignment 6', streak: 300, image: bg3 },
  { id: 7, title: 'Assignment 7', streak: 350, image: bg3 },
  { id: 8, title: 'Assignment 8', streak: 400, image: bg3 }
  
  // ... add more assignments
];

const AssignmentBox = ({ title, streak, image }) => {
  const bgOverlay = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)');
  
  const handleUnlock = () => {
    toast.info(`Unlocking ${title}`);
  };

  return (
    
    
    <Box
      height="250px"
      borderRadius="lg"
      overflow="hidden"
      position="relative"
      boxShadow="xl"
      transition="transform 0.3s"
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Box
        backgroundImage={`url(${image})`}
        backgroundSize="cover"
        backgroundPosition="center"
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
      />
      <VStack
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg={bgOverlay}
        justify="center"
        p={4}
        spacing={4}
      >
        <Heading size="md" textAlign="center">
          {title}
        </Heading>
        <Text fontSize="sm" textAlign="center">
          Unlock by maintaining a continuous streak of {streak} days
        </Text>
        <Button
          leftIcon={<LockIcon />}
          colorScheme="teal"
          onClick={handleUnlock}
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
        >
          Unlock Now
        </Button>
      </VStack>
    </Box>
    
  );
};

export const Assignments = () => {
  return (
    <>
        <Navbar/>
    <Container maxW="container.xl" py={8}>
      <Heading textAlign="center" mb={8} fontSize="3xl" fontWeight="bold">
        Assignments
      </Heading>
      <SimpleGrid columns={{base: 1, md: 2, lg: 3 }} spacing={6}>
        {assignments.map((assignment) => (
          <AssignmentBox key={assignment.id} {...assignment} />
        ))}
      </SimpleGrid>
    </Container>
    </>
  );
};