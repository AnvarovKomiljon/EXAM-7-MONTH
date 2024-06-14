import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, DesktopOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const GeneralLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); ``
    navigate('/login'); 
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            
            {
              key: '2',
              icon: <DesktopOutlined />,
              label: 'Category',
              onClick: () => navigate('/category'),
            },
            {
              key: '3',
              icon: <DesktopOutlined />,
              label: 'Product',
              onClick: () => navigate('/product'),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between', 
            alignItems: 'center', 
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 74,
              height: 64,
            }}
          />
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              marginRight: '20px', 
            }}
          >
            Log Out
          </Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 560,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default GeneralLayout;
