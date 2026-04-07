import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const createModel = () => {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        throw new Error("Missing Gemini API key. Set GEMINI_API_KEY in Backend/.env.");
    }

    return new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash-lite",
        apiKey
    });
};

export const testai = async () => {
    const model = createModel();
    const response = await model.invoke("what is the capital of France?");
    return response.content;
};
