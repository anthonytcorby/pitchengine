import { useLocalStorage } from './use-local-storage';
import { useCallback } from 'react';

export type MessageType = 'announcement' | 'fixture' | 'system' | 'dm';
export type MessageStatus = 'read' | 'unread';

export interface Message {
    id: string;
    type: MessageType;
    status: MessageStatus;
    sender: {
        name: string;
        role: string;
        avatar?: string;
    };
    subject: string;
    preview: string;
    content: string;
    timestamp: string;
    isPinned?: boolean;
    meta?: {
        fixtureId?: string;
        location?: string;
        weather?: string;
        matchFee?: number;
    };
    readCount?: number;
    total?: number;
}

const MOCK_MESSAGES: Message[] = [
    {
        id: '1',
        type: 'fixture',
        status: 'unread',
        sender: { name: 'Fixture Bot', role: 'System' },
        subject: 'MATCHDAY: vs Red Star FC',
        preview: 'Kickoff 14:00 • Hackney Marshes',
        content: '',
        timestamp: '10:30 AM',
        isPinned: true,
        meta: {
            location: 'Hackney Marshes',
            weather: 'Rain likely',
            matchFee: 5
        }
    },
    {
        id: '2',
        type: 'announcement',
        status: 'read',
        sender: { name: 'Anthony Corby', role: 'Manager' },
        subject: 'Training Cancelled',
        preview: 'Guys, pitch is completely flooded...',
        content: 'Guys, pitch is completely flooded. No training tonight. Rest up and we go again on Sunday.',
        timestamp: 'Yesterday',
        readCount: 12,
        total: 15
    },
    {
        id: '3',
        type: 'system',
        status: 'unread',
        sender: { name: 'Automated System', role: 'Admin' },
        subject: 'Match Fees Overdue',
        preview: 'You have 2 outstanding match fees.',
        content: 'Please settle your outstanding balance of £10.00 immediately.',
        timestamp: 'Yesterday'
    }
];

export function useMessages() {
    const [messages, setMessages] = useLocalStorage<Message[]>('wts-messages', MOCK_MESSAGES);

    const addMessage = useCallback((msg: Message) => {
        setMessages(prev => [msg, ...prev]);
    }, [setMessages]);

    const deleteMessage = useCallback((id: string) => {
        setMessages(prev => prev.filter(m => m.id !== id));
    }, [setMessages]);

    const markAsRead = useCallback((id: string) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' as MessageStatus } : m));
    }, [setMessages]);

    return {
        messages,
        addMessage,
        deleteMessage,
        markAsRead,
        setMessages
    };
}
