import React, { useState} from 'react'
import { Stack, HStack, VStack, FormControl, FormLabel ,Input, InputRightElement, InputGroup, Button, useToast} from '@chakra-ui/react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

function SignUp() {
  const [show,setShow] = useState(false);
  const [name,setName] =  useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confpassword,setconfpassword] = useState("");
  const [pic,setPic] = useState("");
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  const history = useNavigate();

  const handleClick = ()=>{
    (show)?(setShow(false)):(setShow(true));
  }

  // https://api.cloudinary.com/v1_1/dbwhvgs1l

  const postDetails = (pics)=>{
    setLoading(true);
    if(!pics){
      toast({
      title:"Please Select an Image!",
      status : "warning",
      duration : 5000,
      isClosable : true,
      position : "bottom",
      });
      return ;
    }
    if(pics.type==="image/png" || pics.type==="image/jpeg"){
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset","chatapp");
      data.append("cloud_name","dbwhvgs1l");

      fetch("https://api.cloudinary.com/v1_1/dbwhvgs1l/image/upload",{
        method:'post',
        body:data,
      }).then((res)=>res.json())
      .then((data)=>{
        setPic(data.url.toString());
        console.log(data.url.toString());
        setLoading(false);
      })
      .catch(err=>{
        console.log(err);
        setLoading(false);
      })
    }
    else{
      toast({
        title:"Please Select an Image!",
        status : "warning",
        duration : 5000,
        isClosable : true,
        position : "bottom",
        });
        return ;
    }
  }

  const submitDetails = async()=>{
    setLoading(false);
    if(!name || !email || !password ||  !confpassword){
      toast({
        title:"please Fill all the fields",
        status : "warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setLoading((false));
      return ;
    }
    if(password!==confpassword){
      toast({
        title:"passwords do not match",
        status : "warning",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setLoading((false));
      return ;
    }

    try{
      const config = {
        headers : {
          "Content-type" : "application/json",
        },
      };
      const {data} = await axios.post("/api/user",{name,email,password,pic},config);
      toast({
        title:"Registeration Successful",
        status : "success",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      localStorage.setItem("userinfo" , JSON.stringify(data))
      setLoading(false);
      history("/chats");
    }catch(error){
      console.log(error);
      toast({
        title:"Error Occured",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      });
      setLoading(false);
    }
  }

  axios.defaults.baseURL = "http://localhost:5000/";
  return (
    <div>
      <VStack spacing="5px">
        <FormControl id='first-name' isRequired>
          <FormLabel>Name</FormLabel>
          <Input
          placeholder = "Enter Your Name"
          onChange = {(e)=>{setName(e.target.value)}}
          />
        </FormControl>

        <FormControl id='email' isRequired>
          <FormLabel>Email</FormLabel>
          <Input
          placeholder = "Enter Your Email"
          onChange = {(e)=>{setEmail(e.target.value)}}
          />
        </FormControl>

        <FormControl id='password' isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
          <Input
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

        <FormControl id='password' isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
          <Input
          type= {show?"text":'password'}
          placeholder = "Confirm Password"
          onChange = {(e)=>{setconfpassword(e.target.value)}}
          />

          <InputRightElement width='4.5rem'>
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ?"Hide":"Show"}
            </Button>
          </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
          <FormLabel> Upload your Picture </FormLabel>
          <Input type="file" p={1.5} accept='image/*' onChange={(e)=>postDetails(e.target.files[0])}/>
        </FormControl>

        <Button colorScheme='blue' width="100%" style={{marginTop:15}} onClick={submitDetails} isLoading={loading}>Sign Up</Button>

      </VStack>
    </div>
  )
}

export default SignUp
