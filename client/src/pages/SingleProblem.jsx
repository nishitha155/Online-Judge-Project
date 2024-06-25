import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Badge,
  Divider,
  Button,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Resizable } from 're-resizable';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const SingleProblem = () => {
  const [code, setCode] = useState('class Solution {\npublic:\n    int longestOnes(vector<int>& nums, int k) {\n        \n    }\n};');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex h="100vh" bg={bgColor}>
      <Resizable
        defaultSize={{ width: '50%', height: '100%' }}
        minWidth="30%"
        maxWidth="70%"
      >
        <Box
          h="100%"
          overflowY="auto"
          p={6}
          borderRight="1px"
          borderColor={borderColor}
          bg={cardBgColor}
        >
          <VStack align="stretch" spacing={6}>
            <Heading size="lg" color={useColorModeValue('blue.600', 'blue.300')}>
              Max Consecutive Ones
            </Heading>
            <Badge colorScheme="orange" alignSelf="flex-start">
              Medium
            </Badge>
            <Text>
              Given a binary array nums and an integer k, return the maximum number of consecutive 1's in
              the array if you can flip at most k 0's.
            </Text>
            <Box>
              <Heading size="md" mb={2}>
                Example 1:
              </Heading>
              <Text fontFamily="monospace" whiteSpace="pre-wrap">
                Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
                Output: 6
                Explanation: [1,1,1,0,0,<u>1,1,1,1,1,1</u>]
                Bolded numbers were flipped from 0 to 1. The longest subarray is underlined.
              </Text>
            </Box>
            <Box>
              <Heading size="md" mb={2}>
                Example 2:
              </Heading>
              <Text fontFamily="monospace" whiteSpace="pre-wrap">
                Input: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3
                Output: 10
                Explanation: [0,0,<u>1,1,1,1,1,1,1,1,1,1</u>,0,0,0,1,1,1,1]
                Bolded numbers were flipped from 0 to 1. The longest subarray is underlined.
              </Text>
            </Box>
          </VStack>
        </Box>
      </Resizable>
      <Box flex={1} display="flex" flexDirection="column">
        <Flex p={2} bg={useColorModeValue('gray.100', 'gray.700')} alignItems="center">
          <Button size="sm" leftIcon={<Icon as={ChevronLeftIcon} />} mr={2}>
            Previous
          </Button>
          <Button size="sm" rightIcon={<Icon as={ChevronRightIcon} />}>
            Next
          </Button>
          <Divider orientation="vertical" mx={4} height="20px" />
          <Text fontWeight="bold">C++</Text>
        </Flex>
        <Box flex={1} p={4} bg={cardBgColor}>
          <SyntaxHighlighter
            language="cpp"
            style={tomorrow}
            customStyle={{
              height: '100%',
              margin: 0,
              borderRadius: '4px',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </Box>
      </Box>
    </Flex>
  );
};