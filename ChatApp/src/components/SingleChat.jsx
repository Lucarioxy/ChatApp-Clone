import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box, Text } from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { Spinner } from '@chakra-ui/spinner';
import { FormControl, Input, useToast } from '@chakra-ui/react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { io } from 'socket.io-client'
import {Lottie} from 'react-lottie'
import animationData from "../animations/typing.json"

const defaultOptions = {
    loop:true,
    autoplay:true,
    animationData:animationData,
    renderSettings:{
        preserveAspectRatio:"xMidYMid slice"
    }
}

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

function SingleChat() {
    const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => { setSocketConnected(true) });
        socket.on("typing", () => setTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])

    const toast = useToast();

    axios.defaults.baseURL = "http://localhost:5000/"

    const sendMessage = async (e) => {
        // since its async the value of nnewmessage will not be changed quickly
        setNewMessage("");
        if (e.key === "Enter" && newMessage) {
            socket.emit('stop typing',selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                console.log(data);
                socket.emit("new message", data);
                setMessages([...messages, data]);
            }
            catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: "Failed to send the Message",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true);
            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            )
            console.log(data);
            setMessages(data);
            setLoading(false);

            socket.emit('join chat', selectedChat._id);
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failed to send the Message",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };


    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                    if (!notification.includes(newMessageRecieved)) {
                      setNotification([newMessageRecieved, ...notification]);
                      setFetchAgain(!fetchAgain);
                    }
            }
            else {
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    return (
        <>
            {(selectedChat) ? (
                <>
                    <Text fontSize={{ base: '30px', md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" display='flex' justifyContent={{ base: "space-between" }} alignItems="center">
                        <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")} />
                        {(!selectedChat.isGroupChat) ? (<>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>) : ((
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {
                                    <UpdateGroupChatModal
                                        fetchMessages={fetchMessages}
                                    />
                                }
                            </>
                        ))}
                    </Text>
                    <Box d="flex" flexDir="column" justifyContent='flex-end' p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius='lg' overflowY='hidden'>
                        {loading ? (<Spinner
                            size='xl'
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                        />) : (<div>
                            <div className="messages flex flox-col overflow-y-scroll no-scrollbar">
                                <ScrollableChat messages={messages} />
                            </div>
                        </div>)}
                    </Box>
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    {isTyping?
                    <div>
                        <Lottie
                        options={defaultOptions}
                        width={70}
                        style = {{marginBottom:15,marginLeft:0}}
                        />
                    </div>:(<></>)}
                        <Input
                            variant='filled'
                            value={newMessage}
                            bg="#E0E0E0"
                            placeholder='Enter a message..'
                            onChange={(event) => { typingHandler(event) }}
                        />
                    </FormControl>
                </>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' h="100%">
                    <Text fontSize='3xl' pb={3} fontFamily="Work sans">
                        Click on a User to start chatting
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat
