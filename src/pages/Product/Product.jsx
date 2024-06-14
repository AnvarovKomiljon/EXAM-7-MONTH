import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Modal, message } from 'antd';
import axios from 'axios';

const { confirm } = Modal;

const ProductPage = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const token = localStorage.getItem('token');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://ecommerce-backend-fawn-eight.vercel.app/api/products', {
        headers: { Authorization: token },
      });
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (values) => {
    setLoading(true);
    try {
      await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/products', values, {
        headers: { Authorization: token },
      });
      message.success('Product created successfully');
      fetchProducts();
      form.resetFields();
      setIsCreateModalVisible(false);
    } catch (error) {
      message.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      await axios.put(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${editingProduct._id}`, values, {
        headers: { Authorization: token },
      });
      message.success('Product updated successfully');
      fetchProducts();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure delete this product?',
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${id}`, {
            headers: { Authorization: token },
          });
          message.success('Product deleted successfully');
          fetchProducts();
        } catch (error) {
          message.error('Failed to delete product');
        } finally {
          setLoading(false);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Subtitle', dataIndex: 'subtitle', key: 'subtitle' },
    { title: 'Image', dataIndex: 'image', key: 'image', render: (text) => <img src={text} alt="Product" style={{ width: 50 }} /> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Rate', dataIndex: 'rate', key: 'rate' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Color', dataIndex: 'color', key: 'color' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button style={{ marginRight: 8,backgroundColor: 'dodgerblue', color: 'white' }} onClick={() => { setEditingProduct(record); setIsModalVisible(true);  }}>Edit</Button>
          <Button onClick={() => showDeleteConfirm(record._id)} danger>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" style={{ marginBottom: 10 }} onClick={() => setIsCreateModalVisible(true)}>Create Product</Button>
      
      <Table columns={columns} dataSource={products} rowKey="_id" loading={loading} />

      <Modal
        title="Create Product"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subtitle" label="Subtitle" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="rate" label="Rate" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="color" label="Color" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="size" label="Size" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editingProduct && (
          <Form
            initialValues={editingProduct}
            onFinish={handleUpdate}
            layout="vertical"
          >
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="subtitle" label="Subtitle" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="image" label="Image" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="rate" label="Rate" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="color" label="Color" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="size" label="Size" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Product
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ProductPage;
