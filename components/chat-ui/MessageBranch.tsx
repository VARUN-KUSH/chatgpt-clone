// Renders all messages for a selected conversation branch.
// Handles display logic for different versions of messages.

"use client"
import React, { useState } from "react";

interface MessageVersion {
  id: number;
  text: string;
  response: string;
  version: number;
}

interface MessageBranchProps {
  versions: MessageVersion[]; // List of message versions
}

const MessageBranch: React.FC<MessageBranchProps> = ({ versions }) => {
  const [selectedVersion, setSelectedVersion] = useState<MessageVersion | null>(null);

  const handleVersionClick = (version: MessageVersion) => {
    setSelectedVersion(version);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Message Versions</h2>
      
      {/* Version List */}
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-3 rounded-lg cursor-pointer ${
              selectedVersion?.id === version.id ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleVersionClick(version)}
          >
            <p>Version {version.version}: {version.text}</p>
          </div>
        ))}
      </div>

      {/* Selected Version Display */}
      {selectedVersion && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Selected Version {selectedVersion.version}</h3>
          <p className="mt-2">Prompt: {selectedVersion.text}</p>
          <p className="mt-4 text-gray-700">GPT Response:</p>
          <div className="p-3 bg-gray-200 rounded-lg mt-2">
            {selectedVersion.response}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBranch;
