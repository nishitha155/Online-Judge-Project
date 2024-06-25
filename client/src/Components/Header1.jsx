import { useState } from 'react';
import {
  Box, Flex, Text, Input, IconButton, Button, Image, HStack, Circle,
  Popover, PopoverTrigger, PopoverContent, PopoverBody,
  useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/image.png'; // Make sure to update this path

const dsaTopics = [
  'Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees',
  'Graphs', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms'
];

 const Header1 = () => {
    const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
 

  const handleSearch = () => {
    const results = dsaTopics.filter(topic => 
      topic.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (results.length > 0) {
      toast.success(`Found ${results.length} matching topics!`);
    } else {
      toast.info('No matching topics found.');
    }
  };

  const handleSignup = () => {
    navigate('/user/signup');
  };
  const handleLogin = () => {
    navigate('/user/login');
  };

  return (
    <Box bg={bgColor} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={4} flex={1}>
          <Circle size="40px" bg="teal.500" color="white">
            <Image src={logo} alt="Logo" boxSize="30px" />
          </Circle>
          <Text fontSize={["xl", "2xl"]} fontWeight="bold" color="teal.500" display={["none", "block"]}>
            AlgoBug
          </Text>
          <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start">
            <PopoverTrigger>
              <Input
                placeholder="Search DSA topics"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={onOpen}
                width={["100%", "200px", "300px"]}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <Box maxH="200px" overflowY="auto">
                  {dsaTopics
                    .filter(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(topic => (
                      <Button key={topic} variant="ghost" justifyContent="start" width="100%">
                        {topic}
                      </Button>
                    ))
                  }
                </Box>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <IconButton
            aria-label="Search database"
            icon={<SearchIcon />}
            onClick={handleSearch}
            size="sm"
          />
        </HStack>

        <HStack spacing={[2, 4]} flex={1} justifyContent="center">
          
          <Button variant="ghost" size={["sm", "md"]}>Practice</Button>
          <Button variant="ghost" size={["sm", "md"]} display={["none", "inline-flex"]}>Weekly Assignments</Button>
          <Button variant="ghost" size={["sm", "md"]}>Contests</Button>
        </HStack>

        <HStack spacing={4} flex={1} justifyContent="flex-end">
          
          <Button
           
            colorScheme="teal"
            variant="solid"
            onClick={handleSignup}
            size={["sm", "md"]}
          >
            SignUp
          </Button>
          <Button
           
            colorScheme="teal"
            variant="solid"
            onClick={handleLogin}
            size={["sm", "md"]}
          >
            Login
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header1;