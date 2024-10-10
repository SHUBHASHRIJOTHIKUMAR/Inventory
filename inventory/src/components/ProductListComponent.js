import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Table, Modal, Form, Input, Empty, message, Upload } from 'antd';
import {
    UserOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    ShoppingCartOutlined,
    PlusOutlined,
    ExportOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import './ProductListComponent.css';

const { Header, Sider, Content } = Layout;

const ProductList = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalProducts, setTotalProducts] = useState(0);

    // CSV headers
    const csvHeaders = [
        { label: 'S.No', key: 'sno' },
        { label: 'Product Name', key: 'name' },
        { label: 'Price', key: 'price' },
        { label: 'Quantity', key: 'quantity' },
    ];

    // Fetch product data from backend API
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stock');
            setProducts(response.data);
            setTotalProducts(response.data.length);
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to fetch products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('price', parseFloat(values.price));
            formData.append('quantity', values.quantity);
            formData.append('image', fileList[0].originFileObj);

            await axios.post('http://localhost:5000/api/addproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Product added successfully!');
            fetchProducts();
            setIsModalVisible(false);
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error('Error adding product:', error);
            message.error('Failed to add product. Please try again.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setFileList([]);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            key: 'sno',
            render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
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

    const selectedKey = () => {
        switch (location.pathname) {
            case '/':
                return '1';
            case '/product':
                return '2';
            case '/order':
                return '3';
            default:
                return '1';
        }
    };

    // Logout handler
    const handleLogout = () => {
        // Implement any logout logic here if needed (like clearing tokens, etc.)
        navigate('/logout'); // Navigate to Logout component
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible theme="dark" className="custom-sidebar">
                <div className="logo">Inventory</div>
                <Menu theme="dark" mode="inline" selectedKeys={[selectedKey()]}>
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
                                Add New Product
                            </Button>
                            <CSVLink data={filteredProducts} headers={csvHeaders} filename="products.csv" style={{ marginLeft: '16px' }}>
                                <Button type="primary" icon={<ExportOutlined />}>
                                    Export to CSV
                                </Button>
                            </CSVLink>
                        </div>

                        {/* Search Input */}
                        <Input
                            placeholder="Search by Product Name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ marginBottom: '16px', width: '300px' }}
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
                                    onChange: (page, pageSize) => {
                                        setCurrentPage(page);
                                        setPageSize(pageSize);
                                    },
                                    showSizeChanger: true,
                                    pageSizeOptions: ['5', '10', '15'],
                                }}
                            />
                        ) : (
                            <Empty description="No products found" />
                        )}
                    </div>
                </Content>
            </Layout>

            <Modal title="Add New Product" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please input the product name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Upload Image">
                        <Upload
                            beforeUpload={() => false} // Prevent automatic upload
                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                            fileList={fileList}
                        >
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default ProductList;
