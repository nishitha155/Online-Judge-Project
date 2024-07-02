import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Text,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Select as MultiSelect } from 'chakra-react-select';

const dsaTopics = [
  { value: 'Arrays', label: 'Arrays' },
  { value: 'Linked Lists', label: 'Linked Lists' },
  { value: 'Stacks', label: 'Stacks' },
  { value: 'Queues', label: 'Queues' },
  { value: 'Trees', label: 'Trees' },
  { value: 'Graphs', label: 'Graphs' },
  { value: 'Sorting', label: 'Sorting' },
  { value: 'Searching', label: 'Searching' },
  { value: 'Dynamic Programming', label: 'Dynamic Programming' },
  { value: 'Greedy Algorithms', label: 'Greedy Algorithms' },
  { value: 'Backtracking', label: 'Backtracking' },
  { value: 'Bit Manipulation', label: 'Bit Manipulation' },
  { value: 'Math', label: 'Math' },
  { value: 'String Algorithms', label: 'String Algorithms' },
  { value: 'Hashing', label: 'Hashing' },
];

const CreateContest = () => {
  const [contestName, setContestName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [rules, setRules] = useState('');
  const [problems, setProblems] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addProblem = () => {
    setProblems([...problems, {
      title: '',
      statement: '',
      code: '',
      difficulty: 'easy',
      language: 'python',
      tags: [],
      inputDescription: '',
      outputDescription: '',
      points: 0,
      testCases: []
    }]);
  };

  const deleteProblem = (index) => {
    const newProblems = [...problems];
    newProblems.splice(index, 1);
    setProblems(newProblems);
  };

  const updateProblem = (index, field, value) => {
    const newProblems = [...problems];
    newProblems[index][field] = value;
    setProblems(newProblems);
  };

  const addTestCase = (problemIndex) => {
    const newProblems = [...problems];
    newProblems[problemIndex].testCases.push({
      input: '',
      output: '',
      isSample: true
    });
    setProblems(newProblems);
  };

  const deleteTestCase = (problemIndex, testCaseIndex) => {
    const newProblems = [...problems];
    newProblems[problemIndex].testCases.splice(testCaseIndex, 1);
    setProblems(newProblems);
  };

  const updateTestCase = (problemIndex, testCaseIndex, field, value) => {
    const newProblems = [...problems];
    newProblems[problemIndex].testCases[testCaseIndex][field] = value;
    setProblems(newProblems);
  };

  const handleTagChange = (problemIndex, selectedOptions) => {
    const newProblems = [...problems];
    newProblems[problemIndex].tags = selectedOptions.map(option => option.value);
    setProblems(newProblems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contestData = { contestName, startTime, duration, rules, problems };
    
    try {
      const response = await fetch('http://localhost:2000/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contestData),
      });

      if (response.ok) {
        toast({
          title: 'Contest Created',
          description: 'Your contest has been successfully created!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onOpen(); // Open the modal to show the contest ID
      } else {
        throw new Error('Failed to create contest');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create contest. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="6xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center" color="teal.500">
          Create New Contest
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch" bg="white" p={6} borderRadius="md" boxShadow="md">
            {/* Contest details form controls */}
            <FormControl isRequired>
              <FormLabel>Contest Name</FormLabel>
              <Input
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
                placeholder="Enter contest name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Duration (in minutes)</FormLabel>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in minutes"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Rules</FormLabel>
              <Textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Enter contest rules"
              />
            </FormControl>

            <Divider my={4} />

            <Heading as="h2" size="lg" color="teal.500">
              Problems
            </Heading>
            {problems.map((problem, problemIndex) => (
              <Box key={problemIndex} p={4} borderWidth={1} borderRadius="md">
                <VStack spacing={4} align="stretch">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading as="h3" size="md">
                      Problem {problemIndex + 1}
                    </Heading>
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => deleteProblem(problemIndex)}
                      colorScheme="red"
                      aria-label="Delete problem"
                    />
                  </Flex>
                  {/* Problem form controls */}
                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={problem.title}
                      onChange={(e) => updateProblem(problemIndex, 'title', e.target.value)}
                      placeholder="Enter problem title"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Statement</FormLabel>
                    <Textarea
                      value={problem.statement}
                      onChange={(e) => updateProblem(problemIndex, 'statement', e.target.value)}
                      placeholder="Enter problem statement"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Code</FormLabel>
                    <Textarea
                      value={problem.code}
                      onChange={(e) => updateProblem(problemIndex, 'code', e.target.value)}
                      placeholder="Enter initial code (if any)"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      value={problem.difficulty}
                      onChange={(e) => updateProblem(problemIndex, 'difficulty', e.target.value)}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Language</FormLabel>
                    <Select
                      value={problem.language}
                      onChange={(e) => updateProblem(problemIndex, 'language', e.target.value)}
                    >
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="javascript">JavaScript</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tags</FormLabel>
                    <MultiSelect
                      isMulti
                      options={dsaTopics}
                      value={problem.tags.map(tag => ({ value: tag, label: tag }))}
                      onChange={(selectedOptions) => handleTagChange(problemIndex, selectedOptions)}
                      placeholder="Select tags"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Input Description</FormLabel>
                    <Textarea
                      value={problem.inputDescription}
                      onChange={(e) => updateProblem(problemIndex, 'inputDescription', e.target.value)}
                      placeholder="Describe the input format"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Output Description</FormLabel>
                    <Textarea
                      value={problem.outputDescription}
                      onChange={(e) => updateProblem(problemIndex, 'outputDescription', e.target.value)}
                      placeholder="Describe the output format"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Points</FormLabel>
                    <Input
                      type="number"
                      value={problem.points}
                      onChange={(e) => updateProblem(problemIndex, 'points', parseInt(e.target.value))}
                      placeholder="Enter points for this problem"
                    />
                  </FormControl>

                  <Divider my={4} />

                  <Heading as="h4" size="sm" color="teal.500">
                    Test Cases
                  </Heading>
                  {problem.testCases.map((testCase, testCaseIndex) => (
                    <Box key={testCaseIndex} p={3} borderWidth={1} borderRadius="md">
                      <VStack spacing={3} align="stretch">
                        <Flex justifyContent="space-between" alignItems="center">
                          <Text fontWeight="bold">Test Case {testCaseIndex + 1}</Text>
                          <IconButton
                            icon={<DeleteIcon />}
                            onClick={() => deleteTestCase(problemIndex, testCaseIndex)}
                            colorScheme="red"
                            size="sm"
                            aria-label="Delete test case"
                          />
                        </Flex>
                        <FormControl>
                          <FormLabel>Input</FormLabel>
                          <Textarea
                            value={testCase.input}
                            onChange={(e) => updateTestCase(problemIndex, testCaseIndex, 'input', e.target.value)}
                            placeholder="Enter input for this test case"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Output</FormLabel>
                          <Textarea
                            value={testCase.output}
                            onChange={(e) => updateTestCase(problemIndex, testCaseIndex, 'output', e.target.value)}
                            placeholder="Enter expected output for this test case"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Type</FormLabel>
                          <Select
                            value={testCase.isSample ? 'sample' : 'locked'}
                            onChange={(e) => updateTestCase(problemIndex, testCaseIndex, 'isSample', e.target.value === 'sample')}
                          >
                            <option value="sample">Sample</option>
                            <option value="locked">Locked</option>
                          </Select>
                        </FormControl>
                      </VStack>
                    </Box>
                  ))}
                  <Button
                    leftIcon={<AddIcon />}
                    onClick={() => addTestCase(problemIndex)}
                    colorScheme="teal"
                    variant="outline"
                  >
                    Add Test Case
                  </Button>
                </VStack>
              </Box>
            ))}
            <Button
              leftIcon={<AddIcon />}
              onClick={addProblem}
              colorScheme="teal"
              size="lg"
            >
              Add Problem
            </Button>
          </VStack>
          <Button
            mt={8}
            colorScheme="teal"
            size="lg"
            type="submit"
            width="full"
          >
            Create Contest
          </Button>
        </form>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contest Created Successfully</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Your contest has been created. The contest ID is: [Contest ID will be displayed here]
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CreateContest;