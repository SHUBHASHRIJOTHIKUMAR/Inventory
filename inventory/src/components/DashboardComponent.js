import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DashboardComponent.css';

const { Header, Sider, Content } = Layout;

const DashboardComponent = () => {
  const [stockCount, setStockCount] = useState(0);
  const navigate = useNavigate(); // Initialize navigate for routing

  useEffect(() => {
    const fetchStockCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/stocks/count');
        setStockCount(response.data.stockCount);
      } catch (error) {
        console.error('Error fetching stock count:', error);
      }
    };

    fetchStockCount();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider collapsible theme="dark" className="custom-sidebar">
        <div className="logo">Inventory</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<AppstoreOutlined />} onClick={() => navigate('/dashboard')}>
            Dashboard Overview
          </Menu.Item>
          <Menu.Item key="2" icon={<UnorderedListOutlined />} onClick={() => navigate('/product')}>
            Product List
          </Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />} onClick={() => navigate('/order')}>
            Orders
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout className="site-layout">
        {/* Header */}
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <div className="header-content">Inventory Management Dashboard</div>
        </Header>

        {/* Content */}
        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Card title="Stock Count" bordered={false}>
              <p>Total Stock: {stockCount}</p>
            </Card>
            <p>Welcome to your Inventory Dashboard. Here you can manage products, orders, and more.</p>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardComponent;
