"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  content: string;
  sender: "user" | "gpt";
  isEditing: boolean;
  branches: string[];
  currentBranchIndex: number;
}


interface Msg {
    // id: number;
    content: string;
    sender: "user" | "gpt";
  }

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleSendMessage = async (content: string, messageId?: string) => {
    if (content.trim() === "") return;

    let updatedMessages: Message[];

    if (messageId) {
      // Editing an existing message
      updatedMessages = messages.map((message) => {
        if (message.id === messageId) {
          const newBranchId = uuidv4();
          return {
            ...message,
            content,
            isEditing: false,
            branches: [...message.branches, newBranchId],
            currentBranchIndex: message.branches.length
          };
        }
        return message;
      });

      // Remove all messages after the edited one
      const editedMessageIndex = updatedMessages.findIndex(m => m.id === messageId);
      updatedMessages = updatedMessages.slice(0, editedMessageIndex + 1);
    } else {
      // Adding a new message
      const newMessage: Message = {
        id: uuidv4(),
        content,
        sender: "user",
        isEditing: false,
        branches: [],
        currentBranchIndex: 0
      };
      updatedMessages = [...messages, newMessage];
    }

    setMessages(updatedMessages);
    setInputValue("");

    // Simulate GPT response (replace with actual API call)
    const gptResponse = await simulateGPTResponse(content);
    const gptMessage: Message = {
      id: uuidv4(),
      content: gptResponse,
      sender: "gpt",
      isEditing: false,
      branches: [],
      currentBranchIndex: 0
    };

    setMessages([...updatedMessages, gptMessage]);
  };

  const handleEditMessage = (id: string) => {
    setMessages(messages.map((message) =>
      message.id === id ? { ...message, isEditing: true } : message
    ));
  };

  const handleCancelEdit = (id: string) => {
    setMessages(messages.map((message) =>
      message.id === id ? { ...message, isEditing: false } : message
    ));
  };

  const handleBranchNavigation = (id: string, direction: 'prev' | 'next') => {
    setMessages(messages.map((message) => {
      if (message.id === id) {
        const newIndex = direction === 'prev'
          ? Math.max(0, message.currentBranchIndex - 1)
          : Math.min(message.branches.length - 1, message.currentBranchIndex + 1);
        return { ...message, currentBranchIndex: newIndex };
      }
      return message;
    }));
  };

  const simulateGPTResponse = async (prompt: string): Promise<string> => {
    // Replace this with actual API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // return `GPT response to: "${prompt}"`;
    const newMessage: Msg = {
        // create a unique id for each msg
        // id: messages.length + 1,
        content: inputValue,
        sender: "user",
      };
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
      return `GPT response to: "${prompt}"`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
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
            {message.isEditing && message.sender === "user" ? (
              <div>
                <textarea
                  value={inputValue || message.content}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 text-black rounded"
                />
                <div className="mt-2">
                  <button
                    onClick={() => handleSendMessage(inputValue, message.id)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => handleCancelEdit(message.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span>{message.content}</span>
                {message.sender === "user" && (
                  <button
                    className="ml-2 text-sm text-gray-200 hover:text-gray-400"
                    onClick={() => handleEditMessage(message.id)}
                  >
                    ✏️
                  </button>
                )}
                {message.branches.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleBranchNavigation(message.id, 'prev')}
                      disabled={message.currentBranchIndex === 0}
                      className="mr-2 px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
                    >
                      ⬅️ Previous
                    </button>
                    <button
                      onClick={() => handleBranchNavigation(message.id, 'next')}
                      disabled={message.currentBranchIndex === message.branches.length - 1}
                      className="px-2 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
                    >
                      Next ➡️
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Message ChatGPT..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(inputValue);
            }}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => handleSendMessage(inputValue)}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;