import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config({
//   path: "./.env",
// });

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyDQetmZB5FiEaEQgXr9xROwGw677uHWV8k");
// const prompt = "write two lines about labradors mine labrador name is leo"
async function Talktollm(prompt: any) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // prompt = "hello write 2 lines on golden retrievers"

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);
  return text;
  
}

// Talktollm(prompt)

export {Talktollm};