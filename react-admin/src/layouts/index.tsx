import React, { useEffect } from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Outlet, useIntl, setLocale, useModel, history } from 'umi';
import './index.less';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const intl = useIntl();
  const { isLoggedIn, logout } = useModel('user');

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/login');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="en" onClick={() => setLocale('en-US', false)}>
        English
      </Menu.Item>
      <Menu.Item key="cn" onClick={() => setLocale('zh-CN', false)}>
        简体中文
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: intl.formatMessage({ id: 'nav.home' }),
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <div>
          <Dropdown menu={{ items: menu.props.items }} placement="bottomRight">
              <Button type="text" icon={<GlobalOutlined />} style={{ marginRight: 16 }} />
            </Dropdown>
            <Button type="text" onClick={handleLogout} style={{ marginRight: 16 }}>
              Logout
            </Button>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
