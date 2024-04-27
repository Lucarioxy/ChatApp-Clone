import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({children})=>{

    const history = useNavigate();
    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState("");
    const [chats , setChats] = useState([]);
    const [fetchAgain,setFetchAgain] = useState(false);
    const [notification,setNotification] = useState([]);

    
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo)
            history("/");
    },[history]);

    return <ChatContext.Provider value={{user,useState,selectedChat,setSelectedChat,chats,setChats,setFetchAgain,fetchAgain,setNotification,notification}}>
        {children};
    </ChatContext.Provider>
}

export const ChatState=()=>{
    return useContext(ChatContext);
}

export default ChatProvider;