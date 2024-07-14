import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Container, Heading, Text, VStack, HStack, Tag, Badge, Button,
  useDisclosure, Collapse, SimpleGrid, useToast, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  IconButton
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';

export const AllProblems = () => {
  const [problems, setProblems] = useState([]);
  const toast = useToast();
  const [problemToDelete, setProblemToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch('https://algobug.onrender.com/api/problems');
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch problems',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (problem) => {
    setProblemToDelete(problem);
    onOpen();
  };

  const handleDelete = async () => {
    try {
      await fetch(`https://algobug.onrender.com/api/problems/${problemToDelete._id}`, { method: 'DELETE' });
      onClose();
      fetchProblems();
      toast({
        title: 'Success',
        description: 'Problem deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete problem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTestCaseDelete = async (problemId, testCaseId) => {
    try {
      const response = await fetch(`https://algobug.onrender.com/api/testcases/${testCaseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProblems(problems.map(problem => {
          if (problem._id === problemId) {
            return {
              ...problem,
              testCases: problem.testCases.filter(tc => tc._id !== testCaseId)
            };
          }
          return problem;
        }));
        
        toast({
          title: 'Success',
          description: 'Test case deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to delete test case');
      }
    } catch (error) {
      console.error('Error deleting test case:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete test case',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="2xl" textAlign="center" mb={8}>
        All Problems
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {problems.map((problem) => (
          <ProblemCard 
            key={problem._id} 
            problem={problem} 
            onDeleteClick={() => handleDeleteClick(problem)}
            onTestCaseDelete={handleTestCaseDelete}
          />
        ))}
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the problem "{problemToDelete?.title}"?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

const ProblemCard = ({ problem, onDeleteClick, onTestCaseDelete }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} boxShadow="md">
      <VStack align="stretch" spacing={4}>
        <Heading as="h3" size="lg">
          {problem.title}
        </Heading>
        <Text fontSize="sm" noOfLines={3}>
          {problem.statement}
        </Text>
        <HStack wrap="wrap">
          {problem.tags.map((tag) => (
            <Tag key={tag} size="sm" variant="subtle" colorScheme="cyan">
              #{tag}
            </Tag>
          ))}
        </HStack>
        <HStack justify="space-between">
          <Badge colorScheme={getDifficultyColor(problem.difficulty)}>
            {problem.difficulty}
          </Badge>
        </HStack>
        <Button rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={onToggle} size="sm">
          {isOpen ? 'Hide' : 'Show'} Details
        </Button>
        <Collapse in={isOpen} animateOpacity>
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="bold">Input Description:</Text>
            <Text fontSize="sm">{problem.inputDescription}</Text>
            <Text fontWeight="bold">Output Description:</Text>
            <Text fontSize="sm">{problem.outputDescription}</Text>
            <Text fontWeight="bold">Constraints:</Text>
            <Text fontSize="sm">{problem.constraints}</Text>
          </VStack>
         
          {problem.testCases && problem.testCases.length > 0 && (
            <>
              <Text fontWeight="bold" mt={4}>Test Cases:</Text>
              <VStack align="stretch" spacing={2}>
                {problem.testCases.map((testCase, index) => (
                  <Box key={testCase._id || index} borderWidth="1px" borderRadius="md" p={2}>
                    <HStack justify="space-between">
                      <Text fontWeight="bold">{testCase.isSample ? 'Sample ' : ''}Test Case {index + 1}</Text>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        aria-label="Delete test case"
                        onClick={() => onTestCaseDelete(problem._id, testCase._id)}
                      />
                    </HStack>
                    <Text>Input: {testCase.input}</Text>
                    <Text>Output: {testCase.output}</Text>
                  </Box>
                ))}
              </VStack>
            </>
          )}
        </Collapse>
        <HStack justify="space-between">
          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            size="sm"
            as={Link}
            to={`/problems/${problem._id}/update`}
          >
            Update
          </Button>
          <Button 
            leftIcon={<DeleteIcon />} 
            colorScheme="red" 
            size="sm" 
            onClick={onDeleteClick}
          >
            Delete
          </Button>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            size="sm"
            as={Link}
            to={`/problems/${problem._id}/add-testcase`}
          >
            Add Testcases
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'green';
    case 'medium':
      return 'orange';
    case 'hard':
      return 'red';
    default:
      return 'gray';
  }
};

export default AllProblems;