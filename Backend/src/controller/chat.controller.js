import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";
import { generateResponse } from "../services/ai.service.js";
import { generateChatTitle } from "../services/ai.service.js";

export const sendMessage = async (req, res) => {

    const { message, chat: chatId } = req.body;

    try {
        

        let title = null;
        let chat = null;

        if (!chatId) {
            title = await generateChatTitle(message);

            chat = await chatModel.create({
                user: req.user.id,
                title: title
            });
        }

        let currentChatId = chatId || chat._id;

        const userMessage = await messageModel.create({
            chat: currentChatId,
            role: "user",
            content: message
        });

        const allMessages = await messageModel.find({ chat: currentChatId }).sort({ createdAt: 1 });

        const response = await generateResponse(allMessages);

        const aiMessage = await messageModel.create({
            chat: currentChatId,
            role: "ai",
            content: response
        });

        console.log(allMessages)
        res.status(201).json({
            
            title,
            chat,
            userMessage,
            aiMessage
        })

    } catch (error) {
        res.status(500).json(
            {
                message: "Error generating response",
                error
            }
        )
    }
}

export const getChats = async (req, res) => {
    const userId = req.user.id;

    try{
        const chats = await chatModel.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Chats fetched successfully",
            chats
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching chats",
            error
        })

    }
}

export const getMessages = async (req, res) => {
    const chatId = req.params.chatId;
    
    const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

    if(!chat){
        return res.status(404).json({
            message: "Chat not found",
            error: "Chat not found"
        })
    }

    try{
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
        res.status(200).json({
            message: "Messages fetched successfully",
            messages
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching messages",
            error
        })
    }
}

export const deleteChat = async (req, res) => {
    const chatId = req.params.chatId;

    const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

    if(!chat){
        return res.status(404).json({
            message: "Chat not found",
            error: "Chat not found"
        })
    }

    try{
        await messageModel.deleteMany({ chat: chatId });
        await chatModel.deleteOne({ _id: chatId });
        res.status(200).json({
            message: "Chat deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting chat",
            error
        })
    }
}