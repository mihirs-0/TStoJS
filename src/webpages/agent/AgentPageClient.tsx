'use client';

import { Typography } from 'antd';
import { useState } from 'react';
import { useTheme } from '../ui/ant/AntRegistryClient';
import styles from './AgentPageClient.module.css';
import ChatUIClient from './ChatUI/ChatUIClient';
import InterfaceInputClient from './InterfaceInput/InterfaceInputClient';
import JsonViewerClient from './InterfaceInput/JsonViewerClient';

interface ISimpleMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

// Define a generic JSON value type
type TJSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: TJSONValue }
  | TJSONValue[];

export default function AgentPageClient(): React.ReactNode {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ISimpleMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [interfaceDefinition, setInterfaceDefinition] = useState<string>('');
  const [hasStartedConversation, setHasStartedConversation] =
    useState<boolean>(false);
  const [jsonData] = useState<TJSONValue>({
    example: 'This is a sample JSON object',
  });
  const { isDarkMode } = useTheme();
  const { Title } = Typography;

  const handleBeginConversation = (interfaceDefinition: string): void => {
    setInterfaceDefinition(interfaceDefinition);
    setHasStartedConversation(true);
    // Here you would typically send the interface to the agent API
    // and get an initial response
  };

  const handleSubmit = async (evt: React.FormEvent): Promise<void> => {
    evt.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: ISimpleMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // This is a placeholder for the actual API call
      // Replace with your AI agent API integration
      // const response = await fetch('/api/agent', { ... });
      // const data = await response.json();

      // Simulating API response for now
      setTimeout(() => {
        const assistantMessage: ISimpleMessage = {
          id: (Date.now() + 1).toString(),
          content: 'This is a placeholder response from the AI agent.',
          role: 'assistant',
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error communicating with agent:', error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles['root-container']} ${isDarkMode ? styles['dark'] : ''}`}
    >
      <div className={styles['title-container']}>
        <h1>Agent</h1>
      </div>
      <section className={styles['interface-section']}>
        <InterfaceInputClient
          onBeginConversation={handleBeginConversation}
          hasStartedConversation={hasStartedConversation}
          savedInterfaceDefinition={interfaceDefinition}
        />
      </section>

      <section
        className={`${styles['content-container']} ${isDarkMode ? styles['dark'] : ''}`}
      >
        <ChatUIClient
          messages={messages}
          isLoading={isLoading}
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          disabled={!hasStartedConversation}
          placeholder={
            hasStartedConversation
              ? 'Type your message here... (Press Cmd/Ctrl + Enter to send)'
              : 'Define a TypeScript interface above to enable chat'
          }
          emptyStateText={
            !hasStartedConversation
              ? 'Define a TypeScript interface above to begin the conversation.'
              : 'Send a message to start the conversation.'
          }
        />
      </section>
      <section className={styles['json-section']}>
        <JsonViewerClient json={jsonData} />
      </section>
    </div>
  );
}
