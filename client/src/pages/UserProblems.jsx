import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  Tag,
  Button,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Wrap,
  WrapItem,
  Flex,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon, StarIcon, TimeIcon, CheckCircleIcon } from '@chakra-ui/icons';
import Navbar from '../Components/Navbar';
import { Link } from 'react-router-dom';

export const UserProblems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('blue.600', 'blue.300');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, selectedDifficulty, selectedTags, selectedStatus]);

  const fetchProblems = async () => {
    try {
      const response = await fetch('https://algobug.onrender.com/problems');
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(problem =>
        selectedTags.every(tag => problem.tags.includes(tag))
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(problem => problem.status === selectedStatus);
    }

    setFilteredProblems(filtered);
  };

  const allTags = [...new Set(problems.flatMap(problem => problem.tags))];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'orange';
      case 'Hard': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Solved': return CheckCircleIcon;
      case 'Visited': return TimeIcon;
      case 'Not Visited': return StarIcon;
      default: return StarIcon;
    }
  };

  return (
    <>
        <Navbar />
    
    <Box bg={bgColor} minHeight="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          

          <Box bg={cardBgColor} p={6} borderRadius="lg" boxShadow="md">
            <VStack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search problems"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                />
              </InputGroup>
              <HStack spacing={4} width="100%">
                <Select
                  placeholder="Select difficulty"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  bg="white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Select>
                <Select
                  placeholder="Select status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  bg="white"
                >
                  <option value="Not Visited">Not Visited</option>
                  <option value="Visited">Visited</option>
                  <option value="Solved">Solved</option>
                </Select>
              </HStack>
              <Wrap spacing={2}>
                {allTags.map(tag => (
                  <WrapItem key={tag}>
                    <Tag
                      size="md"
                      variant={selectedTags.includes(tag) ? "solid" : "outline"}
                      colorScheme="blue"
                      cursor="pointer"
                      onClick={() => {
                        setSelectedTags(prev =>
                          prev.includes(tag)
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                    >
                      #{tag}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          </Box>

          <VStack spacing={4} align="stretch">
            {filteredProblems.map((problem) => (
              <Box
                key={problem._id}
                bg={cardBgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                borderWidth={1}
                borderColor={borderColor}
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={2}>
                    <Heading as="h3" size="md" color={headingColor}>
                      {problem.title}
                    </Heading>
                    <HStack>
                      <Badge colorScheme={getDifficultyColor(problem.difficulty)} px={2} py={1} borderRadius="full">
                        {problem.difficulty}
                      </Badge>
                      <Icon as={getStatusIcon(problem.status)} color={problem.status === 'Solved' ? 'green.500' : 'gray.500'} />
                      <Text fontSize="sm" color="gray.500">{problem.status}</Text>
                    </HStack>
                    <Wrap>
                      {problem.tags.map((tag) => (
                        <WrapItem key={tag}>
                          <Tag size="sm" colorScheme="purple" variant="outline">
                            #{tag}
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </VStack>
                  <Button as={Link} to={`/problems/${problem._id}/solve`} colorScheme="blue" size="sm">
  Solve
</Button>
                </Flex>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
    </>
  );
};