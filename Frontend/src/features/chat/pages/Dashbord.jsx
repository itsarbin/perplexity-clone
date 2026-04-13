import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useChat } from "../hook/useChat"

const Dashbord = () => {

    const chat = useChat()
    const {user} = useSelector(state => state.auth)
    console.log("User in Dashbord:", user) // Debugging line to check user state
   
    useEffect(()=>{
        chat.initializeSocket()
    }, [])
    
  return (
    <div>Dashbord</div>
  )
}

export default Dashbord