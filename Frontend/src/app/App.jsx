import { useState } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from '../features/auth/useAuth'
import { useEffect } from 'react'





function App() {

  const {handleGetMe} = useAuth()

  useEffect(()=>{
    handleGetMe()
  },[])
 

  return (
    <RouterProvider router={router} />
  )
}

export default App
