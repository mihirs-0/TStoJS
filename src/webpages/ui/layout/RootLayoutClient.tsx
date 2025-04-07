'use client';

import {
  HomeOutlined,
  MoonFilled,
  RobotOutlined,
  SunFilled,
} from '@ant-design/icons';
import { Layout, Menu, Switch } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useTheme } from '../ant/AntRegistryClient';
import styles from './RootLayoutClient.module.css';

const { Content, Footer, Sider } = Layout;

enum MENU_ITEM_NAME {
  HOME = 'Home',
  AGENT = 'Agent',
}

const MENU_ITEMS_CONFIG = [
  {
    icon: HomeOutlined,
    name: MENU_ITEM_NAME.HOME,
    route: '/home',
  },
  {
    icon: RobotOutlined,
    name: MENU_ITEM_NAME.AGENT,
    route: '/agent',
  },
];

const MENU_ITEMS = MENU_ITEMS_CONFIG.map((iconInfo) => ({
  icon: React.createElement(iconInfo.icon),
  key: iconInfo.name,
  label: <Link href={iconInfo.route}>{iconInfo.name}</Link>,
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: Props): React.ReactNode {
  const { isDarkMode, toggleTheme } = useTheme();

  const pathname = usePathname();
  const initialSelectedMenuItem = MENU_ITEMS_CONFIG.find(
    ({ route }) => route === pathname
  );
  const initialRoute = initialSelectedMenuItem?.name ?? '';

  return (
    <Layout hasSider={true} style={{ minHeight: '100vh' }}>
      <Sider
        collapsible={false}
        collapsed={true}
        width={200}
        theme={isDarkMode ? 'dark' : 'light'}
      >
        <div className={styles['sider-content-container']}>
          <Menu
            defaultSelectedKeys={[initialRoute]}
            items={MENU_ITEMS}
            mode='inline'
            theme={isDarkMode ? 'dark' : 'light'}
            style={{ textAlign: 'left' }}
          />
          <div className={styles['theme-toggle-container']}>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonFilled />}
              unCheckedChildren={<SunFilled />}
              className={styles['theme-toggle']}
            />
          </div>
          <div className={styles['grow']} />
          <div className={styles['logo-container']}>
            <img src='https://scoutnow.ai/logo.svg' width={32} />
          </div>
        </div>
      </Sider>
      <Layout>
        <Content style={{ padding: '16px 16px 0px 16px' }}>
          <main style={{ padding: 16 }}>{children}</main>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Shoot for the moon © 2025 Scout AI
        </Footer>
      </Layout>
    </Layout>
  );
}
