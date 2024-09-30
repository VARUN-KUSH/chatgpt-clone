import React from "react";
import MessageBranch from "@/components/chat-ui/MessageBranch";

const ParentComponent: React.FC = () => {
  // Sample message versions (in a real app, this would come from your backend)
  const messageVersions = [
    { id: 1, text: "What is the capital of France?", response: "The capital of France is Paris.", version: 1 },
    { id: 2, text: "What is the capital of Germany?", response: "The capital of Germany is Berlin.", version: 2 },
    { id: 3, text: "What is the capital of Italy?", response: "The capital of Italy is Rome.", version: 3 }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <MessageBranch versions={messageVersions} />
    </div>
  );
};

export default ParentComponent;
