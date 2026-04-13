import {useDispatch} from "react-redux"
import {setUser, setLoading, setError} from "./auth.slice"
import{ login, register, getMe } from "./services/auth.api"

export const useAuth = () => {
    const despatch = useDispatch()

    const handleRegister = async ({email, username, password}) =>{
        despatch(setLoading(true))
        try{
            const response = await register({email, username, password})
        }catch(err){
            despatch(setError(err.response?.data?.message || "Error registering user"))
        }finally{
            despatch(setLoading(false))
        }
    }

    const handleLogin = async ({email, password}) =>{
        despatch(setLoading(true))
        try{
            const response = await login({email, password})
            despatch(setUser(response.user))
        }catch(err){
            despatch(setError(err.response?.data?.message || "Error logging in"))
        }finally{
            despatch(setLoading(false))
        }

       

    }
     const handleGetMe = async () =>{
            despatch(setLoading(true))
            try{
                const response = await getMe()
                despatch(setUser(response.user))
            }catch(err){
                despatch(setError(err.response?.data?.message || "Error fetching user"))
            }finally{
                despatch(setLoading(false))
            }

        }

    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }

    
}