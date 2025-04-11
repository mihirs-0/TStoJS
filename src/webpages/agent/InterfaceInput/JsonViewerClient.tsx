'use client';

import { Card, Typography } from 'antd';
import React from 'react';
import styles from './JsonViewerClient.module.css';

interface JsonViewerProps {
  jsonData: any;
}

export const JsonViewerClient: React.FC<JsonViewerProps> = ({ jsonData }) => {
  const { Title } = Typography;

  return (
    <Card className={styles.jsonViewerContainer} bordered={true}>
      <div className={styles.header}>
        <Title level={3}>JSON Output</Title>
      </div>
      <pre className={styles.jsonDisplay}>
        {JSON.stringify(jsonData, null, 2)}
      </pre>
    </Card>
  );
};
