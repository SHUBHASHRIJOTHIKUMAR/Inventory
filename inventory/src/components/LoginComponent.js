import React from 'react';
import { Form, Input, Button, Card, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import '../components/LoginComponent.css';

const LoginComponent = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const onFinish = async (values) => {
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/api/login', {
        username: values.username,
        password: values.password
      });

      // Show success notification
      notification.success({
        message: 'Login Successful',
        description: 'You have logged in successfully!',
        duration: 2 // Notification will close after 2 seconds
      });

      // Redirect to the Dashboard page
      navigate('/dashboard');

    } catch (error) {
      console.error('Error logging in:', error);

      // Show error notification
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'Error logging in. Please try again.',
        duration: 2
      });
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="Log In">
        <Form
          form={form}
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
        >
          {/* Username Field */}
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {/* Login Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginComponent;
