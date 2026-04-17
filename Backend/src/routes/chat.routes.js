import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { sendMessage,getChats,getMessages,deleteChat } from "../controller/chat.controller.js";

const chatRouter = Router();

chatRouter.post('/messages',authenticate, sendMessage)
chatRouter.get('/', authenticate, getChats);
chatRouter.get('/:chatId/messages', authenticate, getMessages);
chatRouter.delete('/delete/:chatId', authenticate, deleteChat);



export default chatRouter;