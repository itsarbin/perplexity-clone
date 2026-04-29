import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { createAgent, tool } from "langchain";
import { HumanMessage, SystemMessage } from "langchain";
import { searchInternet } from "./tavily.service.js";

const getCurrentDateContext = () => {
    const now = new Date();
    return new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Kolkata"
    }).format(now);
}

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.1,
})

const mistral = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY,
})

// Tavily tool that the agent can call only when it needs live web data.
const searchInternetTool = tool(
    async ({ query }) => {
        const currentDate = getCurrentDateContext();
        const response = await searchInternet(`${query} latest current as of ${currentDate}`);

        // Keep tool output short so the model gets clean context.
        const cleanResults = (response.results || []).map((item, index) => {
            return {
                resultNumber: index + 1,
                title: item.title || "No title",
                publishedDate: item.publishedDate || "No published date",
                content: (item.content || "No content").slice(0, 800)
            };
        });
        return {
            query,
            currentDate,
            results: cleanResults
        };
    },
    {
        name: "search_internet",
        description:
            "Search the public internet for current, recent, changing, or web-specific information. Use this only when the user's question needs live or external information. Do not use it for normal conversation, rewriting, summarizing, or code help based only on the provided chat.",
        schema: z.object({
            query: z.string().min(2).describe("The search query to find relevant information on the internet.")
        })
    }
)

const buildSystemPrompt = () => `
You are a helpful AI assistant.
Current date and day in the user's timezone is ${getCurrentDateContext()}.

You have access to one tool:
- search_internet: use it only when the user needs current, recent, changing, or web-specific information.

Rules:
- Do NOT use the tool for every message.
- If the user asks about current affairs, politics, war, government, elections, leaders, breaking news, or anything time-sensitive, use the tool first.
- Do NOT answer time-sensitive questions from memory.
- If the user asks today's date, day, or current time context, answer using the current date above.
- If the answer is not time-sensitive, answer directly when you can.
- After using web information, give one clear direct answer in the first sentence.
- If search results conflict, prefer official, newest, and most reliable results.
- For current government roles, do not rely on social media snippets when official government or reputable news results are available.
- Only mention uncertainty when the search results are genuinely unclear.
- Do not create a "Sources", "References", or citation section.
- Do not list source titles, URLs, or citations at the end of the answer.
- Explain things simply and clearly.
`

const createChatAgent = () => createAgent({
    model: mistral,
    tools: [searchInternetTool],
    systemPrompt: buildSystemPrompt()
})

const normalizeMessagesForAgent = (allMessages = []) => {
    return allMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
    }))
}

const extractTextFromContent = (content) => {
    if (typeof content === "string") {
        return content;
    }

    if (Array.isArray(content)) {
        return content.map((item) => {
            if (typeof item === "string") {
                return item;
            }

            if (item?.text) {
                return item.text;
            }

            return "";
        }).join("\n").trim();
    }

    return "";
}

const makeLinksClickable = (text) => {
    if (!text) {
        return text;
    }

    // Convert plain URLs into markdown links so ReactMarkdown renders them as clickable anchors.
    return text.replace(/(?<!\]\()https?:\/\/[^\s)]+/g, (url) => `[${url}](${url})`);
}

const stripExistingSourcesSection = (text) => {
    if (!text) {
        return text;
    }

    return text.replace(/\n+(Sources|References|Citations):\s*[\s\S]*$/i, "").trim();
}

const extractTextFromAgentResult = (result) => {
    const directContent = extractTextFromContent(result?.content);
    if (directContent) {
        return makeLinksClickable(directContent);
    }

    const messages = result?.messages || [];

    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const text = extractTextFromContent(messages[index]?.content);
        if (text) {
            return makeLinksClickable(text);
        }
    }

    return "Sorry, I couldn't generate a response.";
}

export const generateResponse = async (allMessages) => {
    try {
        const agent = createChatAgent();
        const result = await agent.invoke({
            messages: normalizeMessagesForAgent(allMessages)
        });

        return stripExistingSourcesSection(extractTextFromAgentResult(result));
    } catch (error) {
        console.error("Error invoking Gemini model:", error);
        throw error;
    }
}

export const generateChatTitle = async (message) => {
    const systemMessage = new SystemMessage("You are a helpful assistant that generates concise and descriptive titles for chat conversations. The title should capture the main topic or theme of the conversation in a 2-5 words.");
    try {
        const response = await mistral.invoke([systemMessage, new HumanMessage(`Generate a concise and descriptive title for the following chat conversation: ${message}`)]);
        return extractTextFromContent(response.content) || "New Chat";
    } catch (error) {
        console.error("Error invoking Mistral model:", error);
        throw error;
    }
}
