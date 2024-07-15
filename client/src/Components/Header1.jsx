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
import logo from '../assets/image.png';

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
        <Circle color="white">
            <Image src={logo} alt="Logo" boxSize="40px" />
          </Circle>
          <Text fontSize={["xl", "2xl"]} fontWeight="bold" color="teal.500" display={["none", "block"]}>
            AlgoBug
          </Text>
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