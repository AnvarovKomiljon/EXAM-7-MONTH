import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const { confirm } = Modal;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ecommerce-backend-fawn-eight.vercel.app/api/categories', {
        headers: {
          Authorization: token
        }
      });
      setCategories(response.data);
    } catch (error) {
      message.error('Failed to fetch categories');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setCurrentCategory(null);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setCurrentCategory(record);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure delete this category?',
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`https://ecommerce-backend-fawn-eight.vercel.app/api/categories/${id}`, {
            headers: {
              Authorization: token
            }
          });
          message.success('Category deleted successfully');
          fetchCategories();
        } catch (error) {
          message.error('Failed to delete category');
          console.error('Delete error:', error);
        }
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const handleOk = async () => {
    try {
      const token = localStorage.getItem('token');
      const values = await form.validateFields();
      if (isEditing) {
        await axios.put(`https://ecommerce-backend-fawn-eight.vercel.app/api/categories/${currentCategory._id}`, values, {
          headers: {
            Authorization: token
          }
        });
        message.success('Category updated successfully');
      } else {
        await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/categories', values, {
          headers: {
            Authorization: token
          }
        });
        message.success('Category added successfully');
      }
      fetchCategories();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to save category');
      console.error('Save error:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
      
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="category" width={100} height={80} />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button style={{ marginRight: 8,border: '1px solid dodgerblue', backgroundColor: 'dodgerblue', color: 'white' }} onClick={() => handleEdit(record)} type="link">Edit</Button>
          <Button style={{ border: '1px solid red', backgroundColor: 'red', color: 'white' }} type="link" danger onClick={() => showDeleteConfirm(record._id)}>Delete</Button>
        </span>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 10 }}>
        Add Category
      </Button>
      <Table columns={columns} dataSource={categories} loading={loading} rowKey="_id" />

      <Modal title={isEditing ? 'Edit Category' : 'Add Category'} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" name="categoryForm">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the category name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true, message: 'Please input the image URL!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
