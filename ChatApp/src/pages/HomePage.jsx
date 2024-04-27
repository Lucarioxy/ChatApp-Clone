import React, { useEffect } from 'react'
import { Container, Box, Text } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import LogIn from '../components/LogIn'
import SignUp from '../components/SignUp'
import { useNavigate } from 'react-router-dom'

function HomePage() {
    const history = useNavigate();
    
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if(userInfo)
            history("/chats");
    },[history]);

    return (
        <Container maxW='xl' centerContent>
            <Box
                display="flex" justifyContent="center" p={3} bg={'white'} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px"
            >
                <Text fontSize='4xl' fontFamily="Work sans">Talk-A-Tive</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant='soft-rounded' >
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <LogIn/>
                        </TabPanel>
                        <TabPanel>
                            <SignUp/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage