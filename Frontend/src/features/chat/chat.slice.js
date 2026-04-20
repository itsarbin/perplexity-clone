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
            const {title,chatId, createdAt} = action.payload;
            const existingChat = state.chats[chatId];
            state.chats[chatId] = {
                id: chatId,
                chatId,
                title: title ?? existingChat?.title ?? "",
                createdAt: createdAt ?? existingChat?.createdAt ?? new Date().toISOString(),
                messages: existingChat?.messages || []
            }
        },

        //this reducer contains messages of user when he is in converstation
        addNewMessage: (state, action) => {
            const { chatId, content, role, messageId } = action.payload;
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    chatId,
                    title: "",
                    createdAt: new Date().toISOString(),
                    messages: []
                };
            }
            state.chats[chatId].messages.push({
                id: messageId ?? `${role}-${Date.now()}`,
                content,
                role
            })
        },

        removeMessage: (state, action) => {
            const { chatId, messageId } = action.payload;
            if (!state.chats[chatId]) {
                return;
            }

            state.chats[chatId].messages = state.chats[chatId].messages.filter(
                (message) => message.id !== messageId
            );
        },

        removeChat: (state, action) => {
            const chatId = action.payload;
            delete state.chats[chatId];

            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },

        replaceChat: (state, action) => {
            const { oldChatId, newChatId, title } = action.payload;
            const previousChat = state.chats[oldChatId] || state.chats[newChatId];

            if (!previousChat) {
                state.chats[newChatId] = {
                    id: newChatId,
                    chatId: newChatId,
                    title: title ?? "",
                    createdAt: new Date().toISOString(),
                    messages: []
                };
            } else {
                state.chats[newChatId] = {
                    ...previousChat,
                    id: newChatId,
                    chatId: newChatId,
                    title: title ?? previousChat.title ?? ""
                };
            }

            if (oldChatId !== newChatId) {
                delete state.chats[oldChatId];
            }
        },

        //this reducer fetches all messages of chats when user clicks on the past chat
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    chatId,
                    title: "",
                    createdAt: new Date().toISOString(),
                    messages: []
                };
            }
            state.chats[chatId].messages = messages.map((message, index) => ({
                id: message.id ?? message._id ?? `${message.role}-${chatId}-${index}`,
                content: message.content,
                role: message.role
            }))
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

export const { createNewChat, addNewMessage, removeMessage, removeChat, replaceChat, setChats, SetCurrentChatId, setLoading, setError, addMessages } = chatSlice.actions;

export default chatSlice.reducer;
