import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { Button, IconButton } from '@chakra-ui/button';
import { ViewIcon } from '@chakra-ui/icons';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { ChatState } from '../context/chatProvider';
import { Image, Text } from '@chakra-ui/react';

function ProfileModal({children}) {
    const {isOpen , onOpen , onClose} = useDisclosure();
    const {user} = ChatState();
  return (
    <>
    {children?(
      <span onClick={onOpen}>{children}</span>
    ):(
      <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    )}
    <Modal size='lg' isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader 
            fontSize='40px'
            fontFamily='Work sans'
            textAlign='center'
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center' justifyContent='space-between'>
            <Image
            borderRadius = 'full'
            boxSize = '150px'
            src={user.pic}
            alt={user.name}
            />
            <Text
            fontSize='25px'
            fontFamily='Work sans'
            textAlign='center'
            >{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
