import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000/auth",
    withCredentials: true,
})

export async function register({ email, username, password }) {
    try {
        const response = await api.post("/register",{
            email,
            username,
            password
        })

        return response.data
    } catch (err) {
        throw err

    }
}

export const login = async ({email, password})=>{

    try{
        const response = await api.post("/login",{
            email,
            password
        })
        return response.data;
    }catch(err){
        throw err
    }

}


export  const getMe = async ()=>{
    try{
        const response = await api.get("/get-me")
        return response.data
    }catch(err){
        throw err
    }
    

}