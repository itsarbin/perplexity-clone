import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage,SystemMessage, AIMessage} from "langchain";

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
})

const mistral = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY,
})


export const generateResponse = async (allMessages) =>{
    try{
        const response = await gemini.invoke(allMessages.map((msg) =>{
            if(msg.role === "user"){
                return new HumanMessage(msg.content);
            } else {
                return new AIMessage(msg.content);
            }
        }));
        return response.content;
      
    } catch (error) {
        console.error("Error invoking Gemini model:", error);
        throw error;

    }
}

export const generateChatTitle = async (message) => {
    const systemMessage = new SystemMessage("You are a helpful assistant that generates concise and descriptive titles for chat conversations. The title should capture the main topic or theme of the conversation in a 2-5 words.");
    try {
        const response = await mistral.invoke([systemMessage, new HumanMessage(`Generate a concise and descriptive title for the following chat conversation: ${message}`)]);
        return response.content;
    } catch (error) {
        console.error("Error invoking Mistral model:", error);
        throw error;
    }
}
