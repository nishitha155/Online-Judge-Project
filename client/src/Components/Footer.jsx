import React from 'react';
import { Box, Flex, Text, Link, VStack, HStack, Divider } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" color="gray.700" py={8}>
      <Flex direction={{ base: 'column', md: 'row' }} maxW="1200px" mx="auto" px={4} justify="space-between">
        <VStack align="flex-start" mb={{ base: 6, md: 0 }}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">Algobug</Text>
          <HStack spacing={4}>
            <Link href="/about" color="gray.600" _hover={{ color: 'gray.800' }}>About</Link>
            <Link href="/contact" color="gray.600" _hover={{ color: 'gray.800' }}>Contact Us</Link>
          </HStack>
        </VStack>
        
        <VStack align={{ base: 'flex-start', md: 'flex-end' }}>
          <HStack spacing={4}>
            <Link href="/help" color="gray.600" _hover={{ color: 'gray.800' }}>Help Center</Link>
            <Link href="/terms" color="gray.600" _hover={{ color: 'gray.800' }}>Terms of Service</Link>
            <Link href="/privacy" color="gray.600" _hover={{ color: 'gray.800' }}>Privacy Policy</Link>
          </HStack>
          <Text color="gray.500" mt={2}>© 2024 AlgoBug. All rights reserved</Text>
        </VStack>
      </Flex>
      
      <Divider my={4} borderColor="gray.300" />
      
    </Box>
  );
};