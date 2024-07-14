import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Box, Flex, VStack, Heading, Text, Tag, Badge, Button, Select, IconButton, List, ListItem, ListIcon,
  Tabs, TabList, TabPanels, Tab, TabPanel, Code, Table, Tr, Th, Td, Thead, Tbody,
  useDisclosure, Stat, StatLabel, StatNumber, StatGroup, Textarea,HStack,
  useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Resizable } from 'react-resizable';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'react-resizable/css/styles.css';
import 'ace-builds/src-noconflict/mode-c_cpp'
import { FaPlay, FaCheck, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Navbar from '../Components/Navbar';
import { useStreakContext } from './StreakContest.jsx';

const ContestEditor = () => {
  const { contestId, problemId } = useParams();
 
  const location = useLocation();
  const { timeLeft, contest } = location.state || {};
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [input, setInput] = useState('');
  const [editorTheme, setEditorTheme] = useState('github');
  const [width, setWidth] = useState(window.innerWidth * 0.4);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const { isOpen: isSubmissionModalOpen, onOpen: onSubmissionModalOpen, onClose: onSubmissionModalClose } = useDisclosure();
  const toast = useToast();
  const authToken = Cookies.get('authToken');
  const { setCurrentStreak, setMaxStreak } = useStreakContext();
  const [runtime, setRuntime] = useState(null);
  const [status, setStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(timeLeft);

  useEffect(() => {
    fetchProblem();
    fetchSubmissions();
  }, [contestId, problemId]);

  useEffect(() => {
    if (contest) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(contest.startTime).getTime() + contest.duration * 60000;
        const difference = endTime - now;

        if (difference > 0) {
          setRemainingTime({
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        } else {
          clearInterval(timer);
          toast.info('Contest has ended');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [contest]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`https://algobug.onrender.com/contests/${contestId}/problems/${problemId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setProblem(response.data);
      setTestCases(response.data.testCases);
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

  const fetchSubmissions = async () => {
    console.log('Fetching submissions for:', contestId, problemId);
    try {
      const response = await axios.get(`http://localhost:5000/api/contests/${contestId}/problems/${problemId}/mysubmissions`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setMySubmissions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };
  
  

  const handleRun = async () => {
    try {
      const response = await fetch(`http://localhost:5000/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, input }),
      });
      const data = await response.json();
      console.log(data.output);
      setOutput(data.output);
    } catch (error) {
      console.error('Error running code:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/contests/${contestId}/problems/${problemId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include',
        body: JSON.stringify({ language, code }),
      });
      const data = await response.json();
      console.log(data);

      setTestResults(data.results);
      setRuntime(data.runtime);
      setStatus(data.status);


      if (data.message === 'Code already submitted, no points added') {
        toast({
          title: "Code already submitted, no points added",
          description: data.message,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        
        setOutput('Code already submitted, no points added');
      }
      else if (data.success) {
        toast({
          title: "Submission Successful",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setOutput(`Submission successful: ${data.message}`);
      } else {
        toast({
          title: "Submission Failed",
          description: `${data.status}: ${data.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setOutput(`Submission failed: ${data.status} - ${data.message}`);
      }

      fetchSubmissions();

    } catch (error) {
      toast({
        title: "Error",
        description: error.data?.error || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setOutput(`Error: ${error.data?.error || error.message}`);
    }
  };

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
    onSubmissionModalOpen();
  };

  const onResize = (event, { size }) => {
    setWidth(size.width);
  };

  const toggleEditorTheme = () => {
    setEditorTheme(editorTheme === 'github' ? 'monokai' : 'github');
  };

  if (!problem) return <Box>Loading...</Box>;

  return (
    <>
      <Navbar />
      <Flex height="100vh">
        <Resizable width={width} height={window.innerHeight} onResize={onResize} resizeHandles={['e']}>
          <Box width={width} height="100%" overflowY="auto" borderRight="1px solid">
            <Tabs>
              <TabList>
                <Tab>Description</Tab>
                <Tab>Submissions</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack align="start" spacing={4}>
                    <Heading size="lg">{problem.title}</Heading>
                    <Flex align="center">
                      <Badge colorScheme={problem.difficulty === 'Easy' ? 'green' : problem.difficulty === 'Hard' ? 'red' : 'orange'}>
                        {problem.difficulty}
                      </Badge>
                      {problem.tags.map(tag => (
                        <Tag key={tag} ml={2}>#{tag}</Tag>
                      ))}
                    </Flex>
                    <Text>{problem.statement}</Text>
                    <Text fontWeight="bold">Input Description:</Text>
                    <Text>{problem.inputDescription}</Text>
                    <Text fontWeight="bold">Output Description:</Text>
                    <Text>{problem.outputDescription}</Text>
                    <Text fontWeight="bold">Constraints:</Text>
                    <Text>{problem.constraints}</Text>
                    <Box borderWidth={1} borderRadius="md" p={4} width="100%">
                      <Text fontWeight="bold">Example 1:</Text>
                      <Text fontWeight="bold">Input:</Text>
                      <Code p={2} borderRadius="md" width="100%">
                        {testCases.length > 0 ? testCases[0].input : 'No sample input available'}
                      </Code>
                      <Text fontWeight="bold" mt={2}>Output:</Text>
                      <Code p={2} borderRadius="md" width="100%" color="purple.500">
                        {testCases.length > 0 ? testCases[0].output : 'No sample output available'}
                      </Code>
                    </Box>
                    <StatGroup>
                      <Stat>
                        <StatLabel>Acceptance</StatLabel>
                        <StatNumber>70%</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Submissions</StatLabel>
                        <StatNumber>{problem.submissions}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Acceptance Rate</StatLabel>
                        <StatNumber>70%</StatNumber>
                      </Stat>
                    </StatGroup>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Tabs>
                    <TabList>
                      <Tab>My Submissions</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                      <Box height="150px" overflowY="auto">
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Language</Th>
                                <Th>Status</Th>
                                <Th>Runtime</Th>
                                <Th>Submitted At</Th>
                                <Th>Action</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {mySubmissions && mySubmissions.length > 0 ? (
                                mySubmissions.map((submission) => (
                                  <Tr key={submission._id}>
                                    <Td>{submission.language}</Td>
                                    <Td>{submission.status}</Td>
                                    <Td>{submission.runtime} ms</Td>
                                    <Td>{new Date(submission.createdAt).toLocaleString()}</Td>
                                    <Td>
                                      <Button size="sm" onClick={() => handleSubmissionClick(submission)}>
                                        View Code
                                      </Button>
                                    </Td>
                                  </Tr>
                                ))
                              ) : (
                                <Tr>
                                  <Td colSpan={5}>No submissions found</Td>
                                </Tr>
                              )}
                            </Tbody>
                          </Table>
                        </Box>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Resizable>
        <Modal isOpen={isSubmissionModalOpen} onClose={onSubmissionModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Submission Code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <AceEditor
                mode={selectedSubmission?.language || 'javascript'}
                theme="github"
                value={selectedSubmission?.code || ''}
                name="submission-code-viewer"
                editorProps={{ $blockScrolling: true }}
                width="100%"
                height="300px"
                readOnly={true}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onSubmissionModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        <Box flex={1} height="100%" overflowY="auto">
          <VStack height="100%" spacing={4} p={4}>
            <Flex width="100%" justify="space-between" align="center">
              <Select value={language} onChange={(e) => setLanguage(e.target.value)} width="200px">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </Select>
              <IconButton
                icon={editorTheme === 'github' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleEditorTheme}
                aria-label="Toggle editor theme"
              />
              <HStack spacing={4}>
                {['hours', 'minutes', 'seconds'].map((unit) => (
                  <Box key={unit} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md" p={2} minW="60px" textAlign="center">
                    <Text fontSize="xl" fontWeight="bold">
                      {remainingTime[unit]}
                    </Text>
                    <Text fontSize="xs" textTransform="uppercase">
                      {unit}
                    </Text>
                  </Box>
                ))}
              </HStack>
            </Flex>
            <AceEditor
              mode={language}
              theme={editorTheme}
              onChange={setCode}
              value={code}
              name="code-editor"
              editorProps={{ $blockScrolling: true }}
              width="100%"
              height="70%"
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
            <Flex width="100%" justify="space-between">
              <Button colorScheme="blue" onClick={handleRun}>Run</Button>
              <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
            </Flex>
            <Tabs width="100%">
              <TabList>
                <Tab>Input</Tab>
                <Tab>Output</Tab>
                <Tab>Verdict</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box height="150px" overflowY="auto">
                    <Code p={2} borderRadius="md" width="100%">
                      <Textarea
                        value={input}
                        placeholder="Input"
                        onChange={(e) => setInput(e.target.value)}
                        size="md"
                        resize="none"
                        w="full"
                        minH="100px"
                        className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500"
                      />
                    </Code>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box height="150px" overflowY="auto">
                    <Code p={2} borderRadius="md" width="100%">
                      <Textarea
                        placeholder="Output"
                        size="md"
                        resize="none"
                        w="full"
                        minH="100px"
                        className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500"
                        value={output}
                        readOnly
                      />
                    </Code>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box height="150px" overflowY="auto">
                    {testResults.length > 0 && (
                      <Box>
                        <Text fontWeight="bold" mb={2}>Test Results:</Text>
                        <List spacing={3}>
                          {testResults.map((result, index) => (
                            <ListItem key={index}>
                              <ListIcon as={result.passed ? FaCheck : FaTimes} color={result.passed ? "green.500" : "red.500"} />
                              Test case {result.testCase}: {result.passed ? "Passed" : "Failed"}
                              {result.error && <Text color="red.500">{result.error}</Text>}
                            </ListItem>
                          ))}
                        </List>
                        <Text mt={2}>Status: {status}</Text>
                        <Text>Runtime: {runtime} ms</Text>
                      </Box>
                    )}
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Box>
      </Flex>
    </>
  );
};

export default ContestEditor;