// Register.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/logo.jpg';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/register', values);
      message.success('Registration successful');
      console.log('Registration response:', response.data);
      navigate('/login');
    } catch (error) {
      message.error('Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{width: '400px', height: '100vh', margin: '0 auto', marginTop: '100px' }}>
      <h1 style={{textAlign: 'center'}}>AUTH    REGISTER</h1>
      <img src={Logo} alt="Logo" className="logo" />
      <Form
        name="register"
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>

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
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={() => navigate('/login')} block>
            Already have an account? Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
