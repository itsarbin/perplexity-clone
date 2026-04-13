import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'


const Protected = ({children}) => {
    const {user} = useSelector(state => state.auth)
    const {loading} = useSelector(state => state.auth)
    const navigate = useNavigate()

    

    if(loading){
        return <div>Loading...</div>
    }

    if(!user){
        navigate("/login")
    }

    return children


  
}

export default Protected