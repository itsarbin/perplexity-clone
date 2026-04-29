import { tavily } from "@tavily/core";

const tavilyClient = tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export const searchInternet = async (query) => {
    if (!query || typeof query !== "string") {
        throw new Error("A valid search query is required");
    }

    try {
        const response = await tavilyClient.search(query, {
            searchDepth: "advanced",
            topic: "general",
            maxResults: 8,
            includeAnswer: false,
            includeRawContent: false,
            autoParameters: true,
            chunksPerSource: 3,
            includeUsage: false
        });

        return response;
    } catch (error) {
        console.error("Tavily search error:", error);
        throw new Error("Failed to perform internet search");
    }
}
