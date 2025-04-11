import React from 'react';
import styles from './ChatUIClient.module.css';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isStreaming }) => {
  return (
    <div className={`${styles.message} ${styles[role]}`}>
      <div className={styles.messageContent}>
        {content}
        {isStreaming && <span className={styles.streamingCursor}>▋</span>}
      </div>
    </div>
  );
}; 