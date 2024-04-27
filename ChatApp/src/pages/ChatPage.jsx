import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Container, Box, Text } from "@chakra-ui/react"

import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/SideDrawer';

function ChatPage() {
    const {user} = ChatState();
    
    return (
        <div className='w-full'>
            {user && <SideDrawer/>}
            <Box display='flex' justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    )
}

export default ChatPage
