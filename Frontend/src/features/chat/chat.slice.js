import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats:{},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        createNewChat:(state,action)=>{
            const {title,chatId} = action.payload;
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: []
            }
        },

        //this reducer contains messages of user when he is in converstation
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload;
            state.chats[chatId].messages.push({
                content,
                role
            })
        },

        //this reducer fetches all messages of chats when user clicks on the past chat
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            state.chats[chatId].messages = messages
        },
        setChats: (state, action)=>{
            state.chats = action.payload
        },
        SetCurrentChatId: (state, action)=>{
            state.currentChatId = action.payload
        },
        setLoading: (state, action)=>{
            state.isLoading = action.payload
        },
        setError: (state, action)=>{
            state.error = action.payload
        }
    }
})

export const { createNewChat, addNewMessage, setChats, SetCurrentChatId, setLoading, setError, addMessages } = chatSlice.actions;

export default chatSlice.reducer;
