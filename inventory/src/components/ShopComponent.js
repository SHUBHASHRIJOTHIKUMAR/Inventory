import React, { useEffect, useState } from 'react';
import { Layout, Card, Col, Row, Empty, Spin, Input, Button, Typography, message, Modal } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ShopComponent.css'; // Import the CSS file for styles

const { Content, Header } = Layout;
const { Title } = Typography;

const ShopComponent = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [distinctCount, setDistinctCount] = useState(0);
    const [distinctProducts, setDistinctProducts] = useState([]);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [cart, setCart] = useState([]); // Cart state to store added products
    const navigate = useNavigate();

    // Fetch product data from backend API
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/stock');
            setProducts(response.data);
            setDistinctCount(response.data.length);
            
            const uniqueProducts = Array.from(
                new Map(response.data.filter(product => product.quantity > 0)
                .map(product => [product.stockImage, product])).values()
            );

            setDistinctProducts(uniqueProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to fetch products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        // Check login status (for example, by checking localStorage for a token)
        const token = localStorage.getItem('authToken'); // Replace with your actual token key
        setIsLoggedIn(!!token); // Set login state based on token presence
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter products based on search query
    const filteredProducts = distinctProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to show the login modal
    const showLoginModal = () => {
        setIsLoginModalVisible(true);
    };

    // Function to handle modal cancel
    const handleCancel = () => {
        setIsLoginModalVisible(false);
    };

    // Function to handle login (dummy function for now)
    const handleLogin = () => {
        message.success('Login successful!');
        setIsLoggedIn(true); // Update login state to true
        localStorage.setItem('authToken', 'dummy-token'); // Save token (dummy implementation)
        handleCancel();
    };

    // Function to add item to the cart
    const addToCart = (product) => {
        if (!isLoggedIn) {
            message.warning('Please log in to add items to your cart.');
            showLoginModal();
            return;
        }

        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                // If the product already exists in the cart, increase the quantity
                return prevCart.map(item => 
                    item.id === product.id ? { ...existingProduct, quantity: existingProduct.quantity + 1 } : item
                );
            }
            // If it's a new product, add it to the cart
            return [...prevCart, { ...product, quantity: 1 }];
        });
        message.success(`${product.name} added to cart!`);
    };

    // Function to handle "Buy Now"
    const buyNow = (product) => {
        if (!isLoggedIn) {
            message.warning('Please log in to proceed.');
            showLoginModal();
            return;
        }

        // Redirect to place order page with the selected product in the cart
        navigate('/place-order', { state: { cart: [product] } });
    };

    // Function to navigate to the Cart component
    const goToCart = () => {
        if (!isLoggedIn) {
            message.warning('Please log in to view your cart.');
            showLoginModal();
            return;
        }
        navigate('/place-order', { state: { cart } }); // Passing the cart state to Place Order component
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header">
                <div className="header-content">
                    <Title level={3} style={{ color: '#fff', margin: 0 }}>Shop</Title>
                    <div className="search-bar">
                        <Input
                            placeholder="Search for products"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ width: '300px', marginRight: '16px' }}
                            prefix={<SearchOutlined />}
                        />
                        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={goToCart} style={{ marginRight: '16px' }}>
                            Cart
                        </Button>
                        <Button type="default" onClick={showLoginModal}>Login</Button>
                    </div>
                </div>
            </Header>
            <Content style={{ margin: '16px' }}>
                <div className="site-layout-background" style={{ padding: '24px' }}>
                    <Title level={4}>Total Products: {distinctCount}</Title>
                    
                    {loading ? (
                        <Spin tip="Loading..." />
                    ) : filteredProducts.length > 0 ? (
                        <Row gutter={[16, 24]}>
                            {filteredProducts.map(product => (
                                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                    <Card
                                        hoverable
                                        cover={<img alt={product.name} src={product.stockImage} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />}
                                        className="product-card"
                                    >
                                        <Card.Meta
                                            title={<span className="product-name">{product.name}</span>}
                                            description={
                                                <div className="product-details">
                                                    <span className="product-price">${product.price}</span>
                                                    <span className="product-quantity">{product.quantity} in stock</span>
                                                </div>
                                            }
                                        />
                                        <div className="card-actions">
                                            <Button type="primary" style={{ marginTop: '16px' }} onClick={() => buyNow(product)}>
                                                Buy Now
                                            </Button>
                                            <Button style={{ marginTop: '16px', marginLeft: '8px' }} onClick={() => addToCart(product)}>
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Empty description="No products found" />
                    )}
                </div>
            </Content>

            {/* Login Modal */}
            <Modal
                title="Login"
                visible={isLoginModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleLogin}>
                        Login
                    </Button>
                ]}
            >
                <div>
                    <Input placeholder="Username" style={{ marginBottom: '16px' }} />
                    <Input type="password" placeholder="Password" />
                </div>
            </Modal>
        </Layout>
    );
};

export default ShopComponent;
