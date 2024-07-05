import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { StreakProvider } from './pages/StreakContest';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ChakraProvider>
  <StreakProvider>
    <App />
    </StreakProvider>
    </ChakraProvider>
   
  </BrowserRouter>,
)