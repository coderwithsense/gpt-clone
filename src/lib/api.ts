import { createTitle } from '@/services/chat.service';
import { addDays, addWeeks, addMonths, isBefore, isAfter, isSameDay } from "date-fns";
import prisma from './prisma';
import { CoreMessage, Message } from 'ai';

export type MessageRole = 'system' | 'user' | 'assistant';

interface CreateMessageParams {
  chatId: string;
  role: MessageRole;
  content?: string;
  prompt?: string;
}

export async function getChats(userId: string) {
  return prisma.chat.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    }
  });
}

export const getChatById = async (chatId: string) => {
  try {
    return await prisma.chat.findUnique({ where: { id: chatId } });
  } catch (error) {
    console.error(`[CHAT_API_FETCH_ERROR]: ${error}`);
    throw error;
  }
};

export const createChat = async (prompt: string, userId: string) => {
  try {
    const newTitle = await createTitle(prompt);
    return await prisma.chat.create({
      data: {
        title: newTitle,
        userId: userId,
      }
    });
  } catch (error) {
    console.error(`[CHAT_API_CREATE_ERROR]: ${error}`);
    throw error;
  }
};

export const deleteChatAndMessages = async (chatId: string) => {
  try {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) throw new Error(`Chat not found with ID: ${chatId}`);

    await prisma.message.deleteMany({ where: { chatId } });
    await prisma.chat.delete({ where: { id: chatId } });

    return { success: true };
  } catch (error) {
    console.error(`[CHAT_API_DELETE_ERROR]: ${error}`);
    throw error;
  }
};

export const createMessage = async ({ chatId, role, content, prompt }: CreateMessageParams) => {
  try {
    const messageContent = role === "user" ? prompt : content;
    if (!messageContent) throw new Error(`Missing content for role: ${role}`);

    return await prisma.message.create({
      data: {
        content: messageContent,
        role,
        chatId
      }
    });
  } catch (error) {
    console.error(`[MESSAGE_API_CREATE_ERROR]: ${error}`);
    throw error;
  }
};

export const getMessagesByChatId = async (chatId: string) => {
  try {
    return await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });
  } catch (error) {
    console.error(`[MESSAGE_API_FETCH_ERROR]: ${error}`);
    throw error;
  }
};

export async function saveMessage(content: string, role: MessageRole, chatId: string) {
  return prisma.message.create({ data: { content, role, chatId } });
}

export const saveUserData = async (userId: string, email: string) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: { clerkId: userId, email }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving user data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export async function deleteMessagesAfter(chatId: string, messageId: string) {
  try {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new Error(`Message not found with ID: ${messageId}`);

    await prisma.message.deleteMany({
      where: {
        chatId,
        createdAt: { gt: message.createdAt }
      }
    });

    return { success: true };
  } catch (error) {
    console.error(`[MESSAGE_API_DELETE_AFTER_ERROR]: ${error}`);
    throw error;
  }
}

export async function updateMessageContent(messageId: string, newContent: string) {
  try {
    return await prisma.message.update({
      where: { id: messageId },
      data: { content: newContent }
    });
  } catch (error) {
    console.error(`[MESSAGE_API_UPDATE_ERROR]: ${error}`);
    throw error;
  }
}

export async function createNewAssistantMessage(chatId: string, content: string) {
  try {
    return await prisma.message.create({
      data: {
        chatId,
        role: 'assistant',
        content
      }
    });
  } catch (error) {
    console.error(`[MESSAGE_API_CREATE_ASSISTANT_ERROR]: ${error}`);
    throw error;
  }
}

// if that messageId is not found, it will return an empty array
export async function getMessagesAfter(chatId: string, messageId: string): Promise<CoreMessage[]> {
  try {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new Error(`Message not found with ID: ${messageId}`);

    return await prisma.message.findMany({
      where: {
        chatId,
        createdAt: { gt: message.createdAt }
      },
      orderBy: { createdAt: 'asc' }
    });
  } catch (error) {
    console.error(`[MESSAGE_API_GET_AFTER_ERROR]: ${error}`);
    throw error;
  }
}