import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/chats",
    withCredentials: true
})


export const sendmessage = async (message, chatId) => {
    try {
        const response = await api.post("/messages", {
            message,
            chat: chatId
        })
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;

    }
}

export const getChats = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        console.error("Error fetching chats:", error);
        throw error;
    }
}

export const getmessages = async (chatId) => {
    try {
        const response = await api.get(`/${chatId}/messages`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        throw error;
    }
}

export const deleteChat = async (chatId) => {
    try {
        const response = await api.delete(`delete/${chatId}`);
        return response.data;

    } catch (error) {       
        console.error("Error deleting chat:", error);
        throw error;
    }
}
