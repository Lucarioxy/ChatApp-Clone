import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter } from 'react-router-dom'
import {ChakraProvider } from '@chakra-ui/react'
import './index.css'
import ChatProvider from './context/chatProvider.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <ChatProvider>
    <ChakraProvider>
    <App />
    </ChakraProvider>
    </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
