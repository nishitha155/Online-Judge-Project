import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FaFireAlt, FaBell, FaPowerOff, FaSearch } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';

export default function Navbar() {
  return (
    <Box py={4} px={6} borderBottom="1px" borderColor="gray.200">
      <Flex alignItems="center">
        <Heading size="md" color="brand.500" fontFamily="heading">
          Logo
        </Heading>
        <Flex ml={8} display={{ base: 'none', md: 'flex' }}>
          <Box
            mr={10}
            color="gray.600"
            _hover={{ color: 'brand.500', cursor: 'pointer' }}
            fontFamily="navLink"
            fontSize="lg"
          >
            Problems
          </Box>
          <Box
            mr={10}
            color="gray.600"
            _hover={{ color: 'brand.500', cursor: 'pointer' }}
            fontFamily="navLink"
            fontSize="lg"
          >
            Contest
          </Box>
          <Box
            mr={10}
            color="gray.600"
            _hover={{ color: 'brand.500', cursor: 'pointer' }}
            fontFamily="navLink"
            fontSize="lg"
          >
            Discuss
          </Box>
          <Box
            mr={10}
            color="gray.600"
            _hover={{ color: 'brand.500', cursor: 'pointer' }}
            fontFamily="navLink"
            fontSize="lg"
          >
            Leaderboard
          </Box>
        </Flex>
        <Spacer />
        <InputGroup mr={4} maxW="200px">
          <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
          <Input type="text" placeholder="Search" focusBorderColor="brand.500" />
        </InputGroup>
        <Tooltip label="Streak">
          <IconButton
            icon={<FaFireAlt />}
            variant="ghost"
            aria-label="Streak"
            mr={2}
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
        </Tooltip>
        <Tooltip label="Notifications">
          <IconButton
            icon={<FaBell />}
            variant="ghost"
            aria-label="Notifications"
            mr={4}
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
        </Tooltip>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="ghost"
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
          <MenuList>
            <MenuItem _hover={{ bg: 'brand.500', color: 'white' }} fontFamily="navLink" fontSize="lg">
              Problems
            </MenuItem>
            <MenuItem _hover={{ bg: 'brand.500', color: 'white' }} fontFamily="navLink" fontSize="lg">
              Contest
            </MenuItem>
            <MenuItem _hover={{ bg: 'brand.500', color: 'white' }} fontFamily="navLink" fontSize="lg">
              Discuss
            </MenuItem>
            <MenuItem _hover={{ bg: 'brand.500', color: 'white' }} fontFamily="navLink" fontSize="lg">
              Leaderboard
            </MenuItem>
          </MenuList>
        </Menu>
        <Tooltip label="Logout">
          <IconButton
            icon={<FaPowerOff />}
            variant="ghost"
            aria-label="Logout"
            _hover={{ bg: 'brand.500', color: 'white' }}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
}