'use client';

import { Button, Card } from 'antd';
import React, { useState } from 'react';
import styles from './AgentPageClient.module.css';
import { ChatUIClient } from './ChatUI/ChatUIClient';
import { JsonViewerClient } from './InterfaceInput/JsonViewerClient';

export const AgentPageClient: React.FC = () => {
  const [interfaceDefinition, setInterfaceDefinition] = useState('');
  const [jsonData, setJsonData] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | undefined>();

  const handleInterfaceSubmit = (value: string) => {
    setInterfaceDefinition(value);
    setJsonData(null);
    setConversationId(undefined);
  };

  const handleJsonComplete = (data: any) => {
    setJsonData(data);
  };

  const handleCopyJson = () => {
    if (jsonData) {
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    }
  };

  return (
    <div className={styles.container}>
      <Card title="TypeScript Interface Input" className={styles.card}>
        <textarea
          className={styles.interfaceInput}
          placeholder="Paste your TypeScript interface here..."
          value={interfaceDefinition}
          onChange={(e) => setInterfaceDefinition(e.target.value)}
          disabled={!!conversationId}
        />
        <Button
          type="primary"
          onClick={() => handleInterfaceSubmit(interfaceDefinition)}
          disabled={!interfaceDefinition.trim() || !!conversationId}
        >
          Start Conversation
        </Button>
      </Card>

      {interfaceDefinition && (
        <Card title="Chat Interface" className={styles.card}>
          <ChatUIClient
            interfaceDefinition={interfaceDefinition}
            onJsonComplete={handleJsonComplete}
            initialConversationId={conversationId}
          />
        </Card>
      )}

      {jsonData && (
        <Card
          title="Generated JSON"
          className={styles.card}
          extra={
            <Button type="primary" onClick={handleCopyJson}>
              Copy JSON
            </Button>
          }
        >
          <JsonViewerClient jsonData={jsonData} />
        </Card>
      )}
    </div>
  );
};
