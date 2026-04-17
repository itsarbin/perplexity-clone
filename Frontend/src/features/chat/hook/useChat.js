import { initializeSocket } from "../services/chat.socket";
import{ sendmessage, getChats, getmessages, deleteChat } from "../services/chat.api";
import { setChats, SetCurrentChatId, setLoading, setError,createNewChat,addNewMessage,addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = ()=>{

    const dispatch = useDispatch();

    const handleSendMessage = async (message, chatId)=>{
        dispatch(setLoading(true));
        try{
            const data = await sendmessage(message, chatId);
            const { chat, aiMessage, userMessage } = data;
            const resolvedChatId = chat?._id || chatId || userMessage?.chat;

            if (chat?._id) {
                dispatch(createNewChat({
                    title: chat.title,
                    chatId: chat._id
                }))
            }

            if (resolvedChatId && userMessage?.content) {
                dispatch(addNewMessage({
                    chatId: resolvedChatId,
                    content: userMessage.content,
                    role: userMessage.role
                }))
            }

            if (resolvedChatId && aiMessage?.content) {
                dispatch(addNewMessage({
                    chatId: resolvedChatId,
                    content: aiMessage.content,
                    role: aiMessage.role
                }))
            }

            if (resolvedChatId) {
                dispatch(SetCurrentChatId(resolvedChatId));
            }
        }catch(error){
            dispatch(setError("Failed to send message"));
        } finally{
            dispatch(setLoading(false));
        }
    }

    const handleGetChats = async ()=>{
        dispatch(setLoading(true));
        try{
            const data = await getChats();
            const { chats } = data;
            dispatch(setChats(chats.reduce((acc, chat)=>{
                acc[chat._id] = {
                    title: chat.title,
                    chatId: chat._id,
                    messages: []
                }
                return acc;
            }, {})));
        } catch(error){
            dispatch(setError("Failed to get chats"));
        } finally{
            dispatch(setLoading(false));

        }
    }

    const handleOpenChat = async (chatId)=>{
        const data = await getmessages(chatId);
        const {messages} = data;
        const formattedMessages = messages.map(message=>({
            content: message.content,
            role: message.role
        }))
        dispatch(addMessages({
            chatId,
            messages: formattedMessages
        }))
        dispatch(SetCurrentChatId(chatId));
    }

    return {
        handleSendMessage,
        handleGetChats, 
        handleOpenChat,
        initializeSocket
    }
}


