import { create } from "zustand";

import type { ChatMessage, EducationLevel } from "@/types";

type ChatState = {
  educationLevel: EducationLevel;
  subject: string;
  topic: string;
  messages: ChatMessage[];
  setLearningContext: (context: Partial<Pick<ChatState, "educationLevel" | "subject" | "topic">>) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  educationLevel: "Secondary",
  subject: "Mathematics",
  topic: "Algebra",
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to DD World School Resource Assistant. Choose a topic and ask me anything."
    }
  ],
  setLearningContext: (context) => set(context),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((message) => (message.id === id ? { ...message, content, isStreaming: false } : message))
    })),
  clearMessages: () => set({ messages: [] })
}));
