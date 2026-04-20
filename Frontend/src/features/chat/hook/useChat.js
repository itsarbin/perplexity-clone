import { initializeSocket } from "../services/chat.socket";
import{ sendmessage, getChats, getmessages, deleteChat } from "../services/chat.api";
import { setChats, SetCurrentChatId, setLoading, setError,createNewChat,addNewMessage,addMessages, removeMessage, removeChat, replaceChat } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = ()=>{

    const dispatch = useDispatch();

    const handleSendMessage = async (message, chatId)=>{
        const optimisticChatId = chatId || `temp-chat-${Date.now()}`;
        const optimisticMessageId = `temp-message-${Date.now()}`;

        if (!chatId) {
            dispatch(createNewChat({
                title: message,
                chatId: optimisticChatId,
                createdAt: new Date().toISOString()
            }));
        }

        dispatch(SetCurrentChatId(optimisticChatId));
        dispatch(addNewMessage({
            chatId: optimisticChatId,
            content: message,
            role: "user",
            messageId: optimisticMessageId
        }));
        dispatch(setLoading(true));
        try{
            const data = await sendmessage(message, chatId);
            const { chat, aiMessage } = data;
            const resolvedChatId = chat?._id || chatId;

            if (resolvedChatId && resolvedChatId !== optimisticChatId) {
                dispatch(replaceChat({
                    oldChatId: optimisticChatId,
                    newChatId: resolvedChatId,
                    title: chat?.title
                }));
            }

            if (resolvedChatId && chat?.title) {
                dispatch(createNewChat({
                    title: chat.title,
                    chatId: resolvedChatId,
                    createdAt: chat.createdAt
                }));
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
            if (chatId) {
                dispatch(removeMessage({
                    chatId: optimisticChatId,
                    messageId: optimisticMessageId
                }));
            } else {
                dispatch(removeChat(optimisticChatId));
            }
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
                    id: chat._id,
                    title: chat.title,
                    chatId: chat._id,
                    createdAt: chat.createdAt,
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
