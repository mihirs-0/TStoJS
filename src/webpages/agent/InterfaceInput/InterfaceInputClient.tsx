'use client';

import { Button, Card, Input, Typography } from 'antd';
import { useState } from 'react';
import { useTheme } from '../../ui/ant/AntRegistryClient';
import styles from './InterfaceInputClient.module.css';

interface InterfaceInputClientProps {
  onBeginConversation: (interfaceDefinition: string) => void;
  hasStartedConversation?: boolean;
  savedInterfaceDefinition?: string;
}

export default function InterfaceInputClient({
  onBeginConversation,
  hasStartedConversation = false,
  savedInterfaceDefinition = '',
}: InterfaceInputClientProps): React.ReactNode {
  const [interfaceDefinition, setInterfaceDefinition] = useState<string>('');
  const { isDarkMode } = useTheme();
  const { Title, Paragraph } = Typography;
  const { TextArea } = Input;

  if (hasStartedConversation) {
    // Display the saved interface definition
    return (
      <Card
        className={`${styles['interface-display']} ${isDarkMode ? styles['dark'] : ''}`}
        bordered={true}
      >
        <Title level={3}>TypeScript Interface</Title>
        <pre
          className={`${styles['interface-code']} ${isDarkMode ? styles['dark'] : ''}`}
        >
          {savedInterfaceDefinition}
        </pre>
      </Card>
    );
  }

  // Display the interface input form
  return (
    <Card
      className={`${styles['interface-input-container']} ${isDarkMode ? styles['dark'] : ''}`}
      bordered={true}
    >
      <div className={styles['interface-input-header']}>
        <Title level={3}>Define TypeScript Interface</Title>
        <Paragraph className={styles['interface-input-description']}>
          Enter a TypeScript interface definition to begin the conversation with
          the agent.
        </Paragraph>
      </div>
      <div className={styles['interface-textarea-container']}>
        <TextArea
          className={`${styles['interface-textarea']} ${isDarkMode ? styles['dark'] : ''}`}
          value={interfaceDefinition}
          onChange={(e) => setInterfaceDefinition(e.target.value)}
          placeholder={`interface IYourInterface {\n  property1: string;\n  property2: number;\n  nestedProperty?: {\n    subProperty: boolean;\n  };\n}`}
          rows={8}
        />
      </div>
      <div className={styles['interface-button-container']}>
        <Button
          type='primary'
          className={styles['begin-button']}
          onClick={() => onBeginConversation(interfaceDefinition)}
          disabled={!interfaceDefinition.trim()}
        >
          Begin Conversation
        </Button>
      </div>
    </Card>
  );
}
