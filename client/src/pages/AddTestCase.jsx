import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, FormControl, FormLabel, Input, VStack, Heading, Textarea, 
  Switch, HStack, useToast, SimpleGrid, Card, CardHeader, CardBody, Text
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

export const AddTestCase = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([{ input: '', output: '', isSample: false }]);

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`https://algobug.onrender.com/${problemId}`);
      const data = await response.json();
      setProblem(data);
    } catch (error) {
      console.error('Error fetching problem:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch problem details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index][field] = value;
    setTestCases(updatedTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', isSample: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://algobug.onrender.com/${problemId}/testcases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testCases }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add test cases');
      }

      toast({
        title: 'Success',
        description: 'Test cases added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/problems');
    } catch (error) {
      console.error('Error adding test cases:', error);
      toast({
        title: 'Error',
        description: 'Failed to add test cases',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!problem) {
    return <Box>Loading...</Box>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Add Test Cases
        </Heading>
        <Card>
          <CardHeader>
            <Heading size="md">{problem.title}</Heading>
          </CardHeader>
          <CardBody>
            <Text>{problem.statement}</Text>
          </CardBody>
        </Card>
        <form onSubmit={handleSubmit}>
          {testCases.map((testCase, index) => (
            <Box key={index} borderWidth={1} borderRadius="lg" p={4} mb={4}>
              <Heading size="md" mb={4}>Test Case {index + 1}</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Input</FormLabel>
                  <Textarea
                    value={testCase.input}
                    onChange={(e) => handleInputChange(index, 'input', e.target.value)}
                    placeholder="Enter input"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Output</FormLabel>
                  <Textarea
                    value={testCase.output}
                    onChange={(e) => handleInputChange(index, 'output', e.target.value)}
                    placeholder="Enter expected output"
                  />
                </FormControl>
              </SimpleGrid>
              <HStack mt={4}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor={`isSample-${index}`} mb="0">
                    Sample Test Case
                  </FormLabel>
                  <Switch
                    id={`isSample-${index}`}
                    isChecked={testCase.isSample}
                    onChange={(e) => handleInputChange(index, 'isSample', e.target.checked)}
                  />
                </FormControl>
              </HStack>
            </Box>
          ))}
          <Button leftIcon={<AddIcon />} onClick={addTestCase} mb={4}>
            Add Another Test Case
          </Button>
          <Button type="submit" colorScheme="blue" size="lg" width="full">
            Submit Test Cases
          </Button>
        </form>
      </VStack>
    </Container>
  );
};

export default AddTestCase;