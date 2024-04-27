import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
import { ChatState } from "..//context/chatProvider";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender } from "../config/ChatLogic";



function SideDrawer() {
  axios.defaults.baseURL = "http://localhost:5000/";
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useNavigate();
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    const something = localStorage.getItem('userInfo');
    console.log(something);
    history("/");
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "top-left"
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);

      setSearchResult(data);
      setLoading(false);

    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the Search Results",
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "top-left"
      });
    }
  }


  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => (c._id === data._id))) setChats([data, ...chats]);

      console.log(data);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }
    catch (error) {
      toast({
        title: "Error in fetching the chat",
        description: error.message,
        status: "warning",
        duration: "5000",
        isClosable: true,
        position: "bottom-left"
      });
    }
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent='space-between'
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant='ghost' onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: 'node', md: 'flex' }} px='4'>Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize='2xl' fontFamily='Work sans'>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
            {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
              <MenuItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p={1}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal >
                {/* <MenuItem>My Profile</MenuItem> */}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px' >Search Users</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button onClick={handleSearch}>
                  Go
                </Button>
              </Box>
              {loading ? (<ChatLoading />) : (searchResult && (searchResult.map((user) => { return (<UserListItem key={user._id} user={user} handleFunction={() => { accessChat(user._id) }} />) })))}
              {loadingChat && <Spinner ml='auto' display='flex' />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </div>
  )
}

export default SideDrawer
