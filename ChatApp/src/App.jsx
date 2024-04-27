import { useState } from 'react'
import {Routes,Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import "./App.css"

function App() {

  return (
    <>
        <div  className='bg-hero-pattern bg-cover h-screen flex'>
          <Routes>
            <Route exact path='/' element={<HomePage/>} />
            <Route exact path='/chats' element={<ChatPage/>} />
          </Routes>
        </div>
    </>
  )
}

export default App
