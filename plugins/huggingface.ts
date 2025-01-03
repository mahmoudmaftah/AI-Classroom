import { HfInference } from "@huggingface/inference";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const apiKey = config.public.huggingFaceApiKey;

  if (!apiKey) {
    console.warn('Hugging Face API key not found in environment variables');
  }

  const client = new HfInference(apiKey);

  const queryHuggingFaceModel = async (prompt: string): Promise<string> => {
    try {
      const messages: ChatMessage[] = [
        {
          role: "user",
          content: prompt,
        },
      ];

      const chatCompletion = await client.chatCompletion({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
        messages,
        max_tokens: 500,
      }) as ChatResponse;
      
      return chatCompletion.choices[0].message.content;
    } catch (error) {
      console.error("Error querying Hugging Face model:", error);
      throw new Error("Failed to fetch response from Hugging Face model.");
    }
  };

  return {
    provide: {
      queryHuggingFaceModel,
    },
  };
});