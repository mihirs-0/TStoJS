'use client';

import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { useTheme } from '../../ui/ant/AntRegistryClient';
import styles from './JsonViewerClient.module.css';

// Define a generic JSON value type
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

interface JsonViewerProps {
  json: JsonValue;
}

export default function JsonViewerClient({
  json,
}: JsonViewerProps): React.ReactNode {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const { isDarkMode } = useTheme();
  const { Title } = Typography;

  const handleCopy = useCallback((): void => {
    const jsonString = JSON.stringify(json, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  }, [json]);

  return (
    <Card
      className={`${styles['json-viewer-container']} ${isDarkMode ? styles['dark'] : ''}`}
      bordered={true}
    >
      <div className={styles['header']}>
        <Title level={3}>JSON Output</Title>
        <Button
          type='primary'
          icon={copySuccess ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          className={styles['copy-button']}
        >
          {copySuccess ? 'Copied!' : 'Copy JSON'}
        </Button>
      </div>
      <pre
        className={`${styles['json-display']} ${isDarkMode ? styles['dark'] : ''}`}
      >
        {JSON.stringify(json, null, 2)}
      </pre>
    </Card>
  );
}
