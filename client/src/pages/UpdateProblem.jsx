import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, FormControl, FormLabel, Input, VStack, Heading, Textarea, 
  Select, HStack, useToast, Tag, TagCloseButton, Wrap, WrapItem
} from '@chakra-ui/react';

const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const languageOptions = ['C', 'C++', 'Java', 'Python'];
const tagOptions = ['Array', 'String', 'HashTable', 'Dynamic Programming', 'Math', 'Greedy', 'Sorting', 'Depth-First Search', 'Binary Search', 'Tree'];

export const UpdateProblem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [problem, setProblem] = useState({
    title: '',
    statement: '',
    difficulty: '',
    language: '',
    tags: [],
    inputDescription: '',
    outputDescription: '',
    constraints: '',
    code: ''
  });

  useEffect(() => {
    fetchProblem();
  }, [problemId]);

  const fetchProblem = async () => {
    try {
      const response = await fetch(`https://algobug.onrender.com/problems/${problemId}`);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProblem({ ...problem, [name]: value });
  };

  const handleTagSelect = (e) => {
    const tag = e.target.value;
    if (tag && !problem.tags.includes(tag)) {
      setProblem({ ...problem, tags: [...problem.tags, tag] });
    }
  };

  const handleTagRemove = (tag) => {
    setProblem({ ...problem, tags: problem.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://algobug.onrender.com/problems/${problemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problem),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update problem');
      }

      toast({
        title: 'Success',
        description: 'Problem updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/problems');
    } catch (error) {
      console.error('Error updating problem:', error);
      toast({
        title: 'Error',
        description: 'Failed to update problem',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Update Problem
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input name="title" value={problem.title} onChange={handleInputChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Statement</FormLabel>
              <Textarea name="statement" value={problem.statement} onChange={handleInputChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Difficulty</FormLabel>
              <Select name="difficulty" value={problem.difficulty} onChange={handleInputChange}>
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Language</FormLabel>
              <Select name="language" value={problem.language} onChange={handleInputChange}>
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Select onChange={handleTagSelect} placeholder="Select tags">
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </Select>
              <Wrap mt={2}>
                {problem.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag size="md" variant="solid" colorScheme="blue">
                      {tag}
                      <TagCloseButton onClick={() => handleTagRemove(tag)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Input Description</FormLabel>
              <Textarea name="inputDescription" value={problem.inputDescription} onChange={handleInputChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Output Description</FormLabel>
              <Textarea name="outputDescription" value={problem.outputDescription} onChange={handleInputChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Constraints</FormLabel>
              <Textarea name="constraints" value={problem.constraints} onChange={handleInputChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Initial Code</FormLabel>
              <Textarea name="code" value={problem.code} onChange={handleInputChange} fontFamily="monospace" />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" width="full">
              Update Problem
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default UpdateProblem;