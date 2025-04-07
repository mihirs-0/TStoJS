'use client';

import { SendOutlined } from '@ant-design/icons';
import { Button, Card, Input } from 'antd';
import React, { useRef } from 'react';
import { useTheme } from '../../ui/ant/AntRegistryClient';
import styles from './ChatUIClient.module.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface ChatUIClientProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (evt: React.FormEvent) => void;
  placeholder?: string;
  emptyStateText?: string;
  disabled?: boolean;
}

export default function ChatUIClient({
  messages,
  isLoading,
  input,
  onInputChange,
  onSubmit,
  placeholder = 'Type your message here... (Press Cmd/Ctrl + Enter to send)',
  emptyStateText = 'Send a message to start the conversation.',
  disabled = false,
}: ChatUIClientProps): React.ReactNode {
  const { isDarkMode } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (
    evt: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    // Only submit if Cmd/Ctrl + Enter is pressed
    if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') {
      onSubmit(evt as unknown as React.FormEvent);
    }
  };

  return (
    <Card
      className={`${styles['chat-container']} ${isDarkMode ? styles['dark'] : ''}`}
      bordered={true}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div
        className={`${styles['messages-container']} ${isDarkMode ? styles['dark'] : ''}`}
      >
        {messages.length === 0 ? (
          <div className={styles['empty-state']}>
            <p>{emptyStateText}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles['message']} ${styles[message.role]} ${isDarkMode ? styles['dark'] : ''}`}
            >
              <div className={styles['message-content']}>{message.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div
            className={`${styles['message']} ${styles['assistant']} ${isDarkMode ? styles['dark'] : ''}`}
          >
            <div className={styles['loading-indicator']}>
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={onSubmit}
        className={`${styles['input-form']} ${isDarkMode ? styles['dark'] : ''}`}
      >
        <Input.TextArea
          ref={textareaRef}
          value={input}
          onChange={(evt) => onInputChange(evt.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${styles['message-input']} ${isDarkMode ? styles['dark'] : ''}`}
          autoSize={{ minRows: 2, maxRows: 6 }}
          disabled={disabled || isLoading}
        />
        <Button
          type='primary'
          htmlType='submit'
          className={styles['send-button']}
          disabled={disabled || isLoading || !input.trim()}
          onClick={(evt: React.MouseEvent<HTMLElement>) => onSubmit(evt)}
          icon={<SendOutlined />}
        >
          Send
        </Button>
      </form>
    </Card>
  );
}
