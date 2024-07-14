import React, { useState, useEffect } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Input, Select, Textarea, VStack, Wrap, WrapItem, Tag, TagCloseButton, useToast, Text, Heading } from '@chakra-ui/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      500: '#319795',
      900: '#1A4451',
    },
  },
});

const tagOptions = ['Array', 'String', 'HashTable', 'Dynamic Programming', 'Math', 'Greedy', 'Sorting', 'Depth-First Search', 'Binary Search', 'Tree'];
const languageOptions = ['C', 'C++', 'Java', 'Python'];

export const AddQuestion = () => {
  const [formData, setFormData] = useState({
    statement: '',
    title: '',
    code: '',
    difficulty: '',
    tags: [],
    inputDescription: '',
    outputDescription: '',
    constraints: '',
    language: '',
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTitleUnique, setIsTitleUnique] = useState(true);
  const [isCheckingTitle, setIsCheckingTitle] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const checkTitleUniqueness = async () => {
      if (formData.title.length > 0) {
        setIsCheckingTitle(true);
        try {
          const response = await fetch(`https://algobug.onrender.com/checktitle/${encodeURIComponent(formData.title)}`);
          const data = await response.json();
          setIsTitleUnique(data.isUnique);
        } catch (error) {
          console.error('Error checking title uniqueness:', error);
        }
        setIsCheckingTitle(false);
      } else {
        setIsTitleUnique(true);
      }
    };

    const debounceTimer = setTimeout(checkTitleUniqueness, 300);
    return () => clearTimeout(debounceTimer);
  }, [formData.title]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagSelect = (e) => {
    const tag = e.target.value;
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setFormData({ ...formData, tags: [...selectedTags, tag] });
    }
  };

  const handleTagRemove = (tag) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updatedTags);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTitleUnique) {
      toast({
        title: 'Error',
        description: 'The title is not unique. Please choose a different title.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      const response = await fetch('https://algobug.onrender.com/addquestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Error adding question');
      }

      toast({
        title: 'Question Added',
        description: 'The question was successfully added.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        statement: '',
        title: '',
        code: '',
        difficulty: '',
        tags: [],
        inputDescription: '',
        outputDescription: '',
        constraints: '',
        language: '',
      });
      setSelectedTags([]);
    } catch (error) {
      console.error('Error adding question:', error);
      console.error('Error details:', error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl" py={8}>
        <Box bg="white" shadow="md" rounded="lg" p={6}>
          <Heading as="h1" size="xl" textAlign="center" mb={6}>
            Add Problem
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              <FormControl isRequired isInvalid={!isTitleUnique}>
                <FormLabel>Title</FormLabel>
                <Input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Enter question title" 
                />
                {!isTitleUnique && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    This title is already in use. Please choose a different one.
                  </Text>
                )}
                {isCheckingTitle && (
                  <Text color="gray.500" fontSize="sm" mt={1}>
                    Checking title uniqueness...
                  </Text>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Statement</FormLabel>
                <Textarea name="statement" value={formData.statement} onChange={handleInputChange} placeholder="Enter question statement" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Code</FormLabel>
                <Textarea name="code" value={formData.code} onChange={handleInputChange} placeholder="Enter initial code" fontFamily="monospace" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Difficulty</FormLabel>
                <Select name="difficulty" value={formData.difficulty} onChange={handleInputChange} placeholder="Select difficulty">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Language</FormLabel>
                <Select name="language" value={formData.language} onChange={handleInputChange} placeholder="Select language">
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <Select onChange={handleTagSelect} placeholder="Select tags">
                  {tagOptions.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </Select>
                <Wrap mt={2}>
                  {selectedTags.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag size="md" variant="solid" colorScheme="teal">
                        {tag}
                        <TagCloseButton onClick={() => handleTagRemove(tag)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Input Description</FormLabel>
                <Textarea name="inputDescription" value={formData.inputDescription} onChange={handleInputChange} placeholder="Describe the input format" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Output Description</FormLabel>
                <Textarea name="outputDescription" value={formData.outputDescription} onChange={handleInputChange} placeholder="Describe the output format" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Constraints</FormLabel>
                <Textarea name="constraints" value={formData.constraints} onChange={handleInputChange} placeholder="Enter constraints" />
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="teal" 
                size="lg" 
                isDisabled={!isTitleUnique || isCheckingTitle}
              >
                Add Question
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </ChakraProvider>
  );
};