import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
  confidence?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  image_url?: string;
  visualizations?: {
    type: 'heatmap' | 'highlight' | 'text' | 'chart';
    data: any;
  }[];
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string, role: 'user' | 'assistant', options?: Partial<Message>) => void;
  sendMessage: (content: string, image_url?: string) => Promise<void>;
  likeFeedback: (id: string) => void;
  dislikeFeedback: (id: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (content, role, options = {}) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      role,
      timestamp: new Date(),
      ...options,
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
    
    return newMessage.id;
  },
  
  sendMessage: async (content, image_url?) => {
    // Add user message
    get().addMessage(content, 'user', { image_url });
    
    // Set loading state
    set({ isLoading: true });
    
    try {
      const messages = get().messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from OpenAI');
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI');
      }
      
      // Add assistant response
      get().addMessage(
        data.choices[0].message.content,
        'assistant',
        {
          model: 'gpt-3.5-turbo',
          confidence: 0.95
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      get().addMessage(
        'Server Error. Please try again later.',
        'assistant'
      );
    } finally {
      set({ isLoading: false });
    }
  },
  
  likeFeedback: (id) => {
    set((state) => ({
      messages: state.messages.map((msg) => 
        msg.id === id ? { ...msg, isLiked: true, isDisliked: false } : msg
      ),
    }));
  },
  
  dislikeFeedback: (id) => {
    set((state) => ({
      messages: state.messages.map((msg) => 
        msg.id === id ? { ...msg, isLiked: false, isDisliked: true } : msg
      ),
    }));
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
}));