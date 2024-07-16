import { useState } from 'react';
import {
  Box, Flex, Text, Button, Image, HStack, Circle,
  useColorModeValue
} from '@chakra-ui/react';
import { FaFire } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import logo from '../assets/image.png';
import { useStreakContext } from '../pages/StreakContest.jsx';

 const Navbar = () => {
  
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const handleLogout = () => {
    // Implement logout logic here
    toast.info('Logged out successfully!');
  };

  return (
    <Box bg={bgColor} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={4} flex={1}>
          <Circle color="white">
            <Image src={logo} alt="Logo" boxSize="40px" />
          </Circle>
          <Link to='/home'>
          <Text fontSize={["xl", "2xl"]} fontWeight="bold" color="teal.500" display={["none", "block"]}>
            AlgoBug
          </Text>
          </Link>
          
        </HStack>

        <HStack spacing={[2, 4]} flex={1} justifyContent="center">
        <Link to="/dashboard">
          <Button variant="ghost" size={["sm", "md"]}>Dashboard</Button>
</Link>
           <Link to="/userproblems">
          <Button variant="ghost" size={["sm", "md"]}>Practice</Button>
          </Link>
           <Link to="/assignments">
          <Button variant="ghost" size={["sm", "md"]}>Assignments</Button>
          </Link>
          
          <Link to="/contest">
          <Button variant="ghost" size={["sm", "md"]}>Contests</Button>
          </Link>
        </HStack>

        <HStack spacing={4} flex={1} justifyContent="flex-end">
          
          <Button
           
            colorScheme="teal"
            variant="solid"
            onClick={handleLogout}
            size={["sm", "md"]}
          >
            Logout
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;