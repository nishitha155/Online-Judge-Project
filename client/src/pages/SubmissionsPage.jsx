import React, { useState, useEffect } from 'react';
import {
  Box, Container, VStack, Text, Table, Thead, Tbody, Tr, Th, Td,
  useColorModeValue, Heading, Button, HStack, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, Code
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Navbar from '../Components/Navbar';

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCode, setSelectedCode] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const authToken = Cookies.get('authToken');

  const fetchSubmissions = async (page) => {
    try {
      const response = await fetch(`https://algobug.onrender.com/api/submissions?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`},
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
  
        const data = await response.json();
        setSubmissions(data.submissions);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to fetch submissions');
      }
    };
  
    useEffect(() => {
      fetchSubmissions(currentPage);
    }, [currentPage, authToken]);
  
    const handleViewCode = (code) => {
      setSelectedCode(code);
      onOpen();
    };
  
    return (
      <>
        <Navbar />
        <Container maxW="container.xl" py={8}>
          <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
            <Heading size="lg" mb={4}>All Submissions</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Problem</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Language</Th>
                  <Th>Runtime</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {submissions.map((submission) => (
                  <Tr key={submission._id}>
                    <Td>{submission.problemId.title}</Td>
                    <Td>{new Date(submission.createdAt).toLocaleString()}</Td>
                    <Td>
                      <Text color={submission.status === 'Accepted' ? 'green.500' : 'red.500'}>
                        {submission.status}
                      </Text>
                    </Td>
                    <Td>{submission.language}</Td>
                    <Td>{submission.runtime} ms</Td>
                    <Td>
                      <Button size="sm" onClick={() => handleViewCode(submission.code)}>
                        View Code
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <HStack justifyContent="center" mt={4}>
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>
              <Text>Page {currentPage} of {totalPages}</Text>
              <Button
                rightIcon={<ChevronRightIcon />}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                isDisabled={currentPage === totalPages}
              >
                Next
              </Button>
            </HStack>
          </Box>
  
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Submission Code</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Code whiteSpace="pre-wrap">{selectedCode}</Code>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </>
    );
  };
  
  export default SubmissionsPage;