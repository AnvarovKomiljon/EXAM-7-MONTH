import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Form, Input, InputNumber } from 'antd';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

const { confirm } = Modal;

const schema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Please input the title!',
  }),
  subtitle: Joi.string().required().messages({
    'string.empty': 'Please input the subtitle!',
  }),
  image: Joi.string().uri().required().messages({
    'string.empty': 'Please input the image URL!',
    'string.uri': 'Please input a valid URL!',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Please input the description!',
  }),
  rate: Joi.number().required().messages({
    'number.base': 'Please input a valid rate!',
  }),
  price: Joi.number().required().messages({
    'number.base': 'Please input a valid price!',
  }),
  color: Joi.string().required().messages({
    'string.empty': 'Please input the color!',
  }),
  size: Joi.string().required().messages({
    'string.empty': 'Please input the size!',
  }),
});

const ProductPage = () => {
  const { control, handleSubmit, reset } = useForm({
    resolver: joiResolver(schema),
  });
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
      reset();
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
        <div style={{ display: 'flex' }}>
          <Button style={{ marginRight: 8, backgroundColor: 'dodgerblue', color: 'white' }} onClick={() => { setEditingProduct(record); setIsModalVisible(true); }}>Edit</Button>
          <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => showDeleteConfirm(record._id)} danger>Delete</Button>
        </div>
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
        <Form onFinish={handleSubmit(handleCreate)} layout="vertical">
          <Form.Item label="Title" name="title">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Subtitle" name="subtitle">
            <Controller
              name="subtitle"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Image URL" name="image">
            <Controller
              name="image"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Rate" name="rate">
            <Controller
              name="rate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <InputNumber {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <InputNumber {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Color" name="color">
            <Controller
              name="color"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Size" name="size">
            <Controller
              name="size"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
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
          <Form onFinish={handleSubmit(handleUpdate)} layout="vertical">
            <Form.Item label="Title" name="title" initialValue={editingProduct.title}>
              <Controller
                name="title"
                control={control}
                defaultValue={editingProduct.title}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Subtitle" name="subtitle" initialValue={editingProduct.subtitle}>
              <Controller
                name="subtitle"
                control={control}
                defaultValue={editingProduct.subtitle}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Image URL" name="image" initialValue={editingProduct.image}>
              <Controller
                name="image"
                control={control}
                defaultValue={editingProduct.image}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Description" name="description" initialValue={editingProduct.description}>
              <Controller
                name="description"
                control={control}
                defaultValue={editingProduct.description}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Rate" name="rate" initialValue={editingProduct.rate}>
              <Controller
                name="rate"
                control={control}
                defaultValue={editingProduct.rate}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <InputNumber {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Price" name="price" initialValue={editingProduct.price}>
              <Controller
                name="price"
                control={control}
                defaultValue={editingProduct.price}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <InputNumber {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Color" name="color" initialValue={editingProduct.color}>
              <Controller
                name="color"
                control={control}
                defaultValue={editingProduct.color}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </Form.Item>
            <Form.Item label="Size" name="size" initialValue={editingProduct.size}>
              <Controller
                name="size"
                control={control}
                defaultValue={editingProduct.size}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} />
                    {error && <p className="error">{error.message}</p>}
                  </>
                )}
              />
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
