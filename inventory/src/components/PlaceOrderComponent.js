import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Card, Button, Typography, message, Spin } from 'antd';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;

const PlaceOrder = () => {
    const location = useLocation();
    const { cart } = location.state || { cart: [] }; // Default to an empty array if no cart is provided
    const [loading, setLoading] = useState(false); // Loading state for placing the order

    // Function to handle order placement
    const handlePlaceOrder = async () => {
        setLoading(true); // Set loading state to true

        // Log cart data before making the API call
        console.log('Cart data:', cart);

        // Prepare products for the API call
        const productsToOrder = cart.map(item => ({
            id: item.id,       // Ensure the correct field name is used
            quantity: item.quantity,
        }));

        try {
            // Make API call to place the order
            const response = await axios.post('http://localhost:5000/api/placeorder', {
                products: productsToOrder // Send the prepared data as the request body
            });

            // Show success message
            message.success('Order placed successfully!');
            console.log('Order response:', response.data); // Log the response if needed

        } catch (error) {
            // Enhanced error handling
            console.error('Error placing order:', error);

            // Check if there's a response from the server
            if (error.response) {
                message.error(`Failed to place the order: ${error.response.data.message || 'Unknown error'}`);
                console.error('Error response:', error.response.data); // Log error response for debugging
            } else {
                message.error('Failed to place the order. Please check your network connection.');
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ margin: '16px' }}>
                <div className="site-layout-background" style={{ padding: '24px' }}>
                    <Title level={2}>Your Cart</Title>
                    {loading ? ( // Show loading spinner while placing the order
                        <Spin tip="Placing your order..." />
                    ) : cart.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {cart.map(item => (
                                <Card
                                    key={item.id}
                                    hoverable
                                    cover={<img alt={item.name} src={item.stockImage} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />}
                                    style={{ width: 300 }}
                                >
                                    <Card.Meta
                                        title={<span className="product-name">{item.name}</span>}
                                        description={
                                            <div className="product-details">
                                                <span className="product-price">${item.price}</span>
                                                <span className="product-quantity">Quantity: {item.quantity}</span>
                                            </div>
                                        }
                                    />
                                </Card>
                            ))}
                            <Button type="primary" onClick={handlePlaceOrder} style={{ marginTop: '16px' }}>
                                Place Order
                            </Button>
                        </div>
                    ) : (
                        <p>Your cart is empty!</p>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default PlaceOrder;
