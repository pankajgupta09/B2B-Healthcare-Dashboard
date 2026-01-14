import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatState {
    messages: ChatMessage[];
    isOpen: boolean;
    isSending: boolean;
}

const initialState: ChatState = {
    messages: [
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi! 👋 I\'m HealthGem AI Assistant. I can help you:\n\n• Book appointments with doctors\n• Find specialists by specialty\n• Check available time slots\n• Answer healthcare questions\n\nHow can I assist you today?',
            timestamp: new Date().toISOString(),
        },
    ],
    isOpen: false,
    isSending: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        toggleChat: (state) => {
            state.isOpen = !state.isOpen;
        },
        openChat: (state) => {
            state.isOpen = true;
        },
        closeChat: (state) => {
            state.isOpen = false;
        },
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        setSending: (state, action: PayloadAction<boolean>) => {
            state.isSending = action.payload;
        },
        clearChat: (state) => {
            state.messages = [initialState.messages[0]];
        },
    },
});

export const { toggleChat, openChat, closeChat, addMessage, setSending, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
