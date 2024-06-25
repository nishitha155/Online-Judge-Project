import React, { useState } from 'react';
import {
  Box, Flex, Text, Input, IconButton, Button, Image, HStack, Circle,
  Popover, PopoverTrigger, PopoverContent, PopoverBody,
  useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaFire } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from '../assets/image.png'; // Make sure to update this path

const dsaTopics = [
  'Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees',
  'Graphs', 'Sorting', 'Searching', 'Dynamic Programming', 'Greedy Algorithms'
];

 const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'white');

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

 

  return (
    <Box bg={bgColor} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={4} flex={1}>
          
            <Image src={logo} alt="Logo" boxSize="60px" />
         
          <Text fontSize={["xl", "2xl"]} fontWeight="bold" color="teal.500" display={["none", "block"]}>
            AlgoBug
          </Text>
          
         
        </HStack>

        <HStack spacing={[2, 4]} flex={1} justifyContent="center">
          
          <Button variant="ghost" size={["sm", "md"]}>Practice</Button>
          <Button variant="ghost" size={["sm", "md"]} display={["none", "inline-flex"]}>Assignments</Button>
          <Button variant="ghost" size={["sm", "md"]}>Contests</Button>
        </HStack>

        
      </Flex>
    </Box>
  );
};

export default Header;