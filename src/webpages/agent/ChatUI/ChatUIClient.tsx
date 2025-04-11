'use client';

import { Button, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import styles from './ChatUIClient.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatUIClientProps {
  interfaceDefinition: string;
  onJsonComplete: (jsonData: any) => void;
  initialConversationId?: string;
}

export const ChatUIClient: React.FC<ChatUIClientProps> = ({
  interfaceDefinition,
  onJsonComplete,
  initialConversationId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialConversationId) {
      loadConversation(initialConversationId);
    }
  }, [initialConversationId]);

  const loadConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/agent?conversationId=${id}`);
      if (!response.ok) throw new Error('Failed to load conversation');
      const data = await response.json();
      setMessages(data.history);
      setConversationId(id);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          interfaceDefinition,
          conversationId
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let result = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        result += chunk;
        setStreamingMessage(result);
      }

      const data = JSON.parse(result);
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      setStreamingMessage('');

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      if (data.isComplete && data.jsonData) {
        onJsonComplete(data.jsonData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
        {streamingMessage && (
          <ChatMessage
            role="assistant"
            content={streamingMessage}
            isStreaming
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
