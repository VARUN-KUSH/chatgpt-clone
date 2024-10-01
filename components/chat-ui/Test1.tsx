"use client"

import React, { useState, useEffect } from "react";

interface Message {
  id?: number;
  content: string;
  role: 'USER' | 'ASSISTANT';
  parentId: number | null;
  chatId: number;
  branchVersion: number;
  isLatest: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

  const handleSendMessage = async (content: string) => {
    if (content.trim() === "") return;

    const newMessage: Message = {
      content,
      role: "USER",
      parentId: messages.length > 0 ? messages[messages.length - 1].id! : null,
      chatId: 1,
      branchVersion: 1,
      isLatest: true
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue("");

    // Simulate GPT response (replace with actual API call)
    const gptResponse = await simulateGPTResponse(content);
    const gptMessage: Message = {
      content: gptResponse,
      role: "ASSISTANT",
      parentId: newMessage.id!,
      chatId: 1,
      branchVersion: 1,
      isLatest: true
    };

    setMessages([...updatedMessages, gptMessage]);
  };

  const handleEditMessage = (id: number) => {
    setEditingMessageId(id);
    const messageToEdit = messages.find(m => m.id === id);
    if (messageToEdit) {
      setInputValue(messageToEdit.content);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInputValue("");
  };

  const handleSaveEdit = async (id: number) => {
    const messageToEdit = messages.find(m => m.id === id);
    if (!messageToEdit) return;

    const newBranchVersion = messageToEdit.branchVersion + 1;
    const editedMessage: Message = {
      ...messageToEdit,
      content: inputValue,
      branchVersion: newBranchVersion,
      isLatest: true
    };

    // Update the original message to not be the latest
    const updatedMessages = messages.map(m => 
      m.id === id ? { ...m, isLatest: false } : m
    );

    // Add the edited message and remove all subsequent messages
    const editIndex = updatedMessages.findIndex(m => m.id === id);
    updatedMessages.splice(editIndex + 1, updatedMessages.length - editIndex - 1, editedMessage);

    setMessages(updatedMessages);
    setEditingMessageId(null);
    setInputValue("");

    // Generate new assistant response for the edited message
    const gptResponse = await simulateGPTResponse(editedMessage.content);
    const gptMessage: Message = {
      content: gptResponse,
      role: "ASSISTANT",
      parentId: editedMessage.id!,
      chatId: 1,
      branchVersion: newBranchVersion,
      isLatest: true
    };

    setMessages([...updatedMessages, gptMessage]);
  };

  const simulateGPTResponse = async (prompt: string): Promise<string> => {
    // Replace this with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return `GPT response to: "${prompt}"`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={`${message.id}-${message.branchVersion}`}
            className={`my-2 p-3 rounded-lg max-w-md ${
              message.role === "USER"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {editingMessageId === message.id ? (
              <div>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 text-black rounded"
                />
                <div className="mt-2">
                  <button
                    onClick={() => handleSaveEdit(message.id!)}
                    className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span>{message.content}</span>
                {message.role === "USER" && message.isLatest && (
                  <button
                    className="ml-2 text-sm text-gray-200 hover:text-gray-400"
                    onClick={() => handleEditMessage(message.id!)}
                  >
                    ✏️
                  </button>
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