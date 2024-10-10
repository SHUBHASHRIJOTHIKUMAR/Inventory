import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Table, Modal, Form, Input, Select, Empty, message } from 'antd';
import {
  UserOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  PlusOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { CSVLink } from 'react-csv'; // Import CSVLink for exporting data
import './OrderListComponent.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const ProductList = () => {
  const navigate = useNavigate(); // Define navigate function
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        const productsWithSno = response.data.map((product, index) => ({
          ...product,
          sno: index + 1,
        }));
        setProducts(productsWithSno);
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Failed to fetch products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchProductList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stock');
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching product list:', error);
      message.error('Failed to fetch product list. Please try again.');
    }
  };

  const showModal = async () => {
    setIsModalVisible(true);
    await fetchProductList();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newOrder = {
        item_id: values.item_id,
        quantity: values.quantity,
        total_price: values.total_price,
      };

      console.log('Submitting new order:', newOrder);

      const response = await axios.post('http://localhost:5000/api/placeorder', newOrder);
      console.log('Order placed:', response.data);

      setProducts((prevProducts) => [
        ...prevProducts,
        { key: prevProducts.length + 1, ...newOrder, sno: prevProducts.length + 1 },
      ]);

      form.resetFields();
      setIsModalVisible(false);
      message.success('Order placed successfully!');
      window.location.reload();

    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Image',
      dataIndex: 'stockImage',
      key: 'stockImage',
      render: (image) => (
        <img 
          src={image} 
          alt="Stock" 
          style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
        />
      ),
    },
  ];

  const csvHeaders = [
    { label: 'S.No', key: 'sno' },
    { label: 'Product Name', key: 'name' },
    { label: 'Total Price', key: 'total_price' },
    { label: 'Quantity', key: 'quantity' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logout handler
  const handleLogout = () => {
    // Implement any logout logic here if needed (like clearing tokens, etc.)
    navigate('/'); // Navigate to the login component or main page
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible theme="dark" className="custom-sidebar">
        <div className="logo">Inventory</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']}>
          <Menu.Item key="1" icon={<AppstoreOutlined />}>
            <Link to="/dashboard">Dashboard Overview</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UnorderedListOutlined />}>
            <Link to="/product">Product List</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
            <Link to="/order">Orders</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-content">Product List</div>
          <Button type="primary" onClick={handleLogout} style={{ marginRight: '16px' }}>
            Logout
          </Button>
        </Header>

        <Content style={{ margin: '16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                Place New Order
              </Button>
              <CSVLink data={products} headers={csvHeaders} filename="products.csv" style={{ marginLeft: '16px' }}>
                <Button type="primary" icon={<ExportOutlined />}>
                  Export to CSV
                </Button>
              </CSVLink>
            </div>

            <Input
              placeholder="Search by product name"
              style={{ marginBottom: '16px', width: '300px' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
              <p>Loading...</p>
            ) : filteredProducts.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: filteredProducts.length,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20'],
                }}
                onChange={handleTableChange}
              />
            ) : (
              <Empty description="No products available" />
            )}

            <Modal
              title="Place New Order"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Place Order
                </Button>,
              ]}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Select Product"
                  name="item_id"
                  rules={[{ required: true, message: 'Please select a product' }]}
                >
                  <Select placeholder="Select a product">
                    {productList.map((product) => (
                      <Option key={product.id} value={product.id}>{product.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[{ required: true, message: 'Please enter the quantity' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProductList;
