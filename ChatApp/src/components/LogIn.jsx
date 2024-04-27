import {VStack, FormControl , FormLabel , Input , Button , InputGroup , InputRightElement,useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function LogIn() {

  axios.defaults.baseURL = "http://localhost:5000/";

  const [show,setShow] = useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState("");

  const toast = useToast();
  const history = useNavigate();

  const handleClick = ()=>{
    (show)?(setShow(false)):(setShow(true));
  }

  const submitDetails = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/chats");
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
  };

  return (
    <div>
      <VStack spacing="5px">

        <FormControl id='email' isRequired>
          <FormLabel>Email</FormLabel>
          <Input
          value={email}
          placeholder = "Enter Your Email"
          onChange = {(e)=>{setEmail(e.target.value)}}
          />
        </FormControl>

        <FormControl id='password' isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
          <Input
          value={password}
          type= {show?"text":'password'}
          placeholder = "Enter the Password"
          onChange = {(e)=>{setPassword(e.target.value)}}
          />

          <InputRightElement width='4.5rem'>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ?"Hide":"Show"}
            </Button>
          </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme='blue' width="100%" style={{marginTop:15}} onClick={submitDetails} isLoading={loading}>Log In</Button>
        <Button colorScheme='red' width="100%" style={{marginTop:15}} onClick={()=>{setEmail("guest@example.com");
        setPassword("123456")
        ;}}>Use Guest Creds</Button>

      </VStack>
    </div>
  )
}

export default LogIn
