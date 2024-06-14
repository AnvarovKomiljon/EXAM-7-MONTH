import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo.jpg';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/auth', values);
      const token = response.data; 
      message.success('Login successful');
      console.log('Login response:', token);

      localStorage.setItem('token', token); 
      navigate('/category')
    } catch (error) {
      message.error('Login failed');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Admin Dashboard Login</h1>
      <img src={Logo} alt="Logo" className="logo" /> 
      <Form
        name="login"
        initialValues={{
          email: 'user@gmail.com',
          password: 'test123',
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
              type: 'email',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
