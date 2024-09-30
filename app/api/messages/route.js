import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { Talktollm } from '@/llm/Talktollm';

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const res = await request.json();
    console.log("res>>>>>>", res);
    const { content, sender, parentId } = res;

    // Check sender type (USER or ASSISTANT)
    const role = sender === 'user' ? 'USER' : 'ASSISTANT';

    // 1. Save the user message to the database
    const userMessage = await prisma.message.create({
      data: {
        content: content,
        role, // Role is either USER or ASSISTANT
        parentId, // Optional, for branching
        chatIndex: await getChatIndex(parentId), // Calculate chatIndex
      },
    });

    // 2. Call LLM (assuming Talktollm is your OpenAI API call)
    let responseofllm = await Talktollm(content);
    console.log("responseofllm>>>>>>>>>>>", responseofllm);

    // 3. Save the assistant's response
    const assistantMessage = await prisma.message.create({
      data: {
        content: responseofllm, // Assistant response content
        role: 'ASSISTANT',
        parentId: userMessage.id, // User's message becomes the parent of the assistant's response
        chatIndex: userMessage.chatIndex + 1, // Next in sequence
      },
    });

    // Return the saved messages or a confirmation using NextResponse
    return NextResponse.json(
      { userMessage, assistantMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving messages:', error);
    return NextResponse.json(
      { error: 'Failed to save messages' },
      { status: 500 }
    );
  }
}

// Helper function to get the next chatIndex
async function getChatIndex(parentId) {
  if (!parentId) {
    // If no parent, this is the first message, so index is 1
    return 1;
  }
  // Get the last message in this branch (i.e., with the same parentId)
  const lastMessage = await prisma.message.findFirst({
    where: { parentId },
    orderBy: { chatIndex: 'desc' },
  });

  // Increment the chatIndex
  return lastMessage ? lastMessage.chatIndex + 1 : 1;
}
