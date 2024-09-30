// Displays the current conversation and messages.
// Allows users to input new messages and edit previous messages.
// Tracks current conversation branches and displays them in a sidebar.

"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: number;
  content: string;
  sender: "user" | "gpt";
}

interface apiresponse {
  
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  // const [response, setResponse] = useState<>([])
  const [inputValue, setInputValue] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

  // Handle message submission
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    if (editingMessageId !== null) {
      // Update the existing message
      const updatedMessages = messages.map((message) =>
        message.id === editingMessageId
          ? { ...message, text: inputValue }
          : message
      );
      setMessages(updatedMessages);
      setEditingMessageId(null); // Reset editing state
    } else {
      // Add the user message to the conversation
      const newMessage: Message = {
        // create a unique id for each msg
        id: messages.length + 1,
        content: inputValue,
        sender: "user",
      };

      setMessages([...messages, newMessage]);

      // Simulate GPT response (this would be replaced by an API call)
      //Type of gpt response
      const gptResponse:any = await fetch(
        "http://localhost:3000/api/messages",
        {
          method: "POST", // HTTP method
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
          body: JSON.stringify(newMessage), // Convert the message object to a JSON string
        }
      );

      // Parse the response JSON
      const data = await gptResponse.json();
      console.log("data>>>>>", data)
      setMessages([...messages, newMessage, data.assistantMessage.content]);
    }

    // Clear input field
    setInputValue("");
  };

  //    Handle editing a message
  const EditMessage = (id: number, text: string) => {
    setEditingMessageId(id);
  };

  const sendtollm = () => {

  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Conversation display */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`my-2 p-3 rounded-lg max-w-md ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {editingMessageId && message.sender === "user" ? (
              <textarea>{message.content}</textarea>
            ) : (
              
              <>
                <span>{message.content}</span>
                <button
                  className="ml-2 text-sm text-gray-200 hover:text-gray-400"
                  onClick={() => EditMessage(message.id, message.content)}
                >
                 ✏️
                </button>
                <button
                onClick={() => {}
                  // sendtollm(message.id, message.text)
                }
                >
                  ➡️
                </button>
              </>
            )}
            
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-4 bg-white flex items-center space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Message ChatGPT..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
