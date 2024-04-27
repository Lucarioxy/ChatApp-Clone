import { Button, IconButton } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import React, { useState } from 'react'
import { ChatState } from '../context/chatProvider';
import { useToast } from '@chakra-ui/toast';
import { Box } from '@chakra-ui/layout';
import UserBadgeItem from './UserBadgeItem';
import { FormControl, Input, Spinner } from '@chakra-ui/react';
import axios from "axios"
import UserListItem from './UserListItem';

function UpdateGroupChatModal({fetchMessages}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user,setFetchAgain,fetchAgain } = ChatState();
  axios.defaults.baseURL = "http://localhost:5000/";


  const toast = useToast();


  const handleAddUser = async (user1) => {
    console.log("calling this function");
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };


  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      console.log(data);

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };


  const handleRename= async()=>{
    if(!groupChatName)return 

    try{
      setRenameLoading(true);
      const config = {
        headers:{
          Authorization : `Bearer ${user.token}`,

        }
      };
      
      const {data} = await axios.put('/api/chat/rename',{
        chatId:selectedChat._id,
        chatName:groupChatName
      },config);

      console.log(data);

      setSelectedChat(data);
      let so = fetchAgain?(false):(true);
      setFetchAgain(so);
      setRenameLoading(false);
    }catch(error){
      console.log(error);
      toast({
        title:"Error Occured!",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  }

  const handleSearch = async(query)=>{
    setSearch(query);
    if(!search){
      toast({
        title : "Please Enter something in search",
        status:"warning",
        duration:"5000",
        isClosable:true,
        position:"top-left"
      });
      return ;
    }

    try{
      setLoading(true);

      const config = {
        headers : {
          Authorization: `Bearer ${user.token}`,
        }
      }
      const {data} = await axios.get(`/api/user?search=${search}`,config); 
      console.log(data);

      setSearchResult(data);
      setLoading(false);

    }catch(error){
      toast({
        title : "Error Occured",
        description : "Failed to load the Search Results",
        status:"warning",
        duration:"5000",
        isClosable:true,
        position:"top-left"
      });
    }
  }

  return (
    <div>
      <>
        <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen}>Open Modal</IconButton>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              display="flex"
              justifyContent="center"
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map((u) => {
                  return (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleRemove(u)}
                    />)
                })}
                <FormControl display="flex">
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button
                    variant="solid"
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                  >
                    Update
                  </Button>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Add User to group "
                    mb={1}
                    onChange={(e) => handleSearch (e.target.value)}
                  />
                </FormControl>
                {loading ? (
                  <Spinner size="lg"/>
                ):(
                  (searchResult && searchResult.map((user)=>{
                    return (
                    <UserListItem key={user._id} user={user} handleFunction={()=>{handleAddUser(user)}}/>
                    )
                  })
                ))}
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='red' onClick={()=>handleRemove(user)}>
                Leave Group
              </Button>

            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </div>
  )
}

export default UpdateGroupChatModal
