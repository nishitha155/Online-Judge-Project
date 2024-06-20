
import React, { useState, useEffect } from 'react';

import { FaClock } from 'react-icons/fa';
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  GridItem,
  Checkbox,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FaCalendarAlt} from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip as ChartTooltip } from 'chart.js';


Chart.register(ArcElement, ChartTooltip);

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch calendar data from API or generate mock data
  const fetchCalendarData = async () => {
    try {
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCalendarData([
        { date: '2023-06-01', solved: true },
        { date: '2023-06-02', solved: false },
        { date: '2023-06-03', solved: true },
        // Add more calendar data here
      ]);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCalendarData();
  }, []);

  return (
   
    <Box>
      <Flex align="center" mb={2}>
        <FaCalendarAlt />
        <Heading size="sm" ml={2}>
          Calendar
        </Heading>
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
          {calendarData.map((day) => (
            <GridItem
              key={day.date}
              bg={day.solved ? 'green.500' : 'white'}
              color={day.solved ? 'white' : 'gray.500'}
              p={1}
              borderRadius="md"
              fontSize="sm"
            >
              {new Date(day.date).getDate()}
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const StreakStats = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [globalLongestStreak, setGlobalLongestStreak] = useState(0);
  const [userLongestStreak, setUserLongestStreak] = useState(0);

  // Fetch streak data from API or generate mock data
  const fetchStreakData = async () => {
    try {
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStreak(3);
      setMaxStreak(7);
      setGlobalLongestStreak(120);
      setUserLongestStreak(25);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  };

  React.useEffect(() => {
    fetchStreakData();
  }, []);

  return (
    <Box mt={4}>
      <Flex align="center" mb={2}>
        <Heading size="sm">Streak Stats</Heading>
      </Flex>
      <Box bg="gray.100" p={4} borderRadius="md">
        <Text>
          Current Streak: <strong>{currentStreak}</strong>
        </Text>
        <Text>
          Max Streak: <strong>{maxStreak}</strong>
        </Text>
      </Box>
      <Box mt={4}>
        <Flex>
          <Box bg="gray.100" p={4} borderRadius="md" mr={2}>
            <Text>Global Longest Streak:</Text>
            <Heading size="md">{globalLongestStreak}</Heading>
          </Box>
          <Box bg="gray.100" p={4} borderRadius="md">
            <Text>Your Longest Streak:</Text>
            <Heading size="md">{userLongestStreak}</Heading>
          </Box>
        </Flex>
      </Box>
    </Box>
   
  );
};

const ProblemStats = () => {
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [problemsAttempted, setProblemsAttempted] = useState(0);

  // Fetch problem stats data from API or generate mock data
  const fetchProblemStats = async () => {
    try {
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProblemsSolved(150);
      setProblemsAttempted(250);
    } catch (error) {
      console.error('Error fetching problem stats:', error);
    }
  };

  React.useEffect(() => {
    fetchProblemStats();
  }, []);

  return (
    <Box mt={4}>
      <Flex align="center" mb={2}>
        <Heading size="sm">Problem Stats</Heading>
      </Flex>
      <Box bg="gray.100" p={4} borderRadius="md">
        <Text>
          Problems Solved: <strong>{problemsSolved}</strong>
        </Text>
        <Text>
          Problems Attempted: <strong>{problemsAttempted}</strong>
        </Text>
      </Box>
    </Box>
  );
};

const ProblemDifficultyChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch problem difficulty data from API or generate mock data
  const fetchProblemDifficultyData = async () => {
    try {
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setChartData({
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
          {
            data: [80, 50, 20],
            backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching problem difficulty data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProblemDifficultyData();
  }, []);

  return (
    <Box mt={4}>
      <Flex align="center" mb={2}>
        <Heading size="sm">Problem Difficulty</Heading>
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      )}
    </Box>
  );
};

const CodingTip = () => {
  const [tip, setTip] = useState('');
  const toast = useToast();

  // Fetch coding tip from API or generate mock data
  const fetchCodingTip = async () => {
    try {
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTip(
        "Always write clean and readable code. Remember, code is read more often than it's written."
      );
    } catch (error) {
      console.error('Error fetching coding tip:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch coding tip',
        status: 'error',
        duration:5000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    fetchCodingTip();
  }, []);

  return (
    <Box bg="gray.100" p={4} borderRadius="md">
      <Heading size="sm" mb={2}>
        Coding Tip of the Day
      </Heading>
      <Text>{tip}</Text>
    </Box>
  );
};




const ProblemOfTheDay = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24 hours in seconds

  // Fetch problem of the day from API or generate mock data
  const fetchProblemOfTheDay = async () => {
    try {
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProblem({
        title: 'Two Sum',
        difficulty: 'Easy',
        timeToComplete: '1 hour',
        tag: 'Array',
      });
    } catch (error) {
      console.error('Error fetching problem of the day:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemOfTheDay();
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box bg="gray.100" p={4} borderRadius="md" mt={4}>
      <Heading size="sm" mb={2}>
        Problem of the Day
      </Heading>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">
          <FaClock /> {formatTime(timeRemaining)}
        </Heading>
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <Box bg="white" p={4} borderRadius="md">
          <Heading size="md" mb={2}>
            {problem.title}
          </Heading>
          <Text mb={2}>
            <strong>Difficulty:</strong> {problem.difficulty}
          </Text>
          <Text mb={2}>
            <strong>Tag:</strong> {problem.tag}
          </Text>
          <Flex justify="flex-end">
            <Button colorScheme="green">Solve</Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};



const PracticeProblems = () => {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [topic, setTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch practice problems from API or generate mock data
  const fetchPracticeProblems = async () => {
    try {
      // Simulating API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProblems([
        {
          id: 1,
          title: 'Two Sum',
          solution: 'https://example.com/solution/1',
          acceptance: '48.7%',
          difficulty: 'Easy',
          status: 'Solved',
          topic: 'Array',
        },
        // Add more practice problems here
      ]);
    } catch (error) {
      console.error('Error fetching practice problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleShuffle = () => {
    // Implement logic to shuffle the problems array
  };

  React.useEffect(() => {
    fetchPracticeProblems();
  }, []);

  return (
    <Box mt={4}>
      <Heading size="md" mb={4}>
        Practice Problems
      </Heading>
      <Flex mb={4}>
        <Select
          placeholder="Difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          mr={2}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
        <Select
          placeholder="Status"
          value={status}
          onChange={handleStatusChange}
          mr={2}
        >
          <option value="solved">Solved</option>
          <option value="attempted">Attempted</option>
          <option value="not-visited">Not Visited</option>
        </Select>
        <Select
          placeholder="Topic"
          value={topic}
          onChange={handleTopicChange}
          mr={2}
        >
          <option value="array">Array</option>
          <option value="string">String</option>
          <option value="linked-list">Linked List</option>
          {/* Add more topics here */}
        </Select>
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          mr={2}
        />
        
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Status</Th>
                <Th>Title</Th>
                <Th>Solution</Th>
                <Th>Acceptance</Th>
                <Th>Difficulty</Th>
              </Tr>
            </Thead>
            <Tbody>
              {problems.map((problem) => (
                <Tr key={problem.id}>
                  <Td>
                    <Checkbox isChecked={problem.status === 'Solved'} />
                  </Td>
                  <Td>{problem.title}</Td>
                  <Td>
                    <Tooltip label="View Solution">
                      <a href={problem.solution} target="_blank" rel="noopener noreferrer">
                        Solution
                      </a>
                    </Tooltip>
                  </Td>
                  <Td>{problem.acceptance}</Td>
                  <Td>{problem.difficulty}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Flex justify="space-between" mt={4}>
            <Button>Previous</Button>
            <Button>Next</Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export const Home = () => {
  return (
    <Flex>
      <Box flex="0.3" pr={4}>
        <Calendar />
        <StreakStats />
        <ProblemStats />
        <ProblemDifficultyChart />
      </Box>
      <Box flex="0.7">
        <CodingTip />
        <ProblemOfTheDay />
        <PracticeProblems />
      </Box>
    </Flex>
  );
};