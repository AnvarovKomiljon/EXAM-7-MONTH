import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Form, Input } from 'antd';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';

const { confirm } = Modal;

const schema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Please input the category name!',
  }),
  image: Joi.string().uri().required().messages({
    'string.empty': 'Please input the image URL!',
    'string.uri': 'Please input a valid URL!',
  }),
});

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const { control, handleSubmit, reset } = useForm({
    resolver: joiResolver(schema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ecommerce-backend-fawn-eight.vercel.app/api/categories', {
        headers: {
          Authorization: token,
        },
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
    reset();
    setCurrentCategory(null);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    reset(record);
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
              Authorization: token,
            },
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
      },
    });
  };

  const onSubmit = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(`https://ecommerce-backend-fawn-eight.vercel.app/api/categories/${currentCategory._id}`, values, {
          headers: {
            Authorization: token,
          },
        });
        message.success('Category updated successfully');
      } else {
        await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/categories', values, {
          headers: {
            Authorization: token,
          },
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
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <img src={image} alt="category" width={100} height={80} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button style={{ marginRight: 8, border: '1px solid dodgerblue', backgroundColor: 'dodgerblue', color: 'white' }} onClick={() => handleEdit(record)} type="link">
            Edit
          </Button>
          <Button style={{ border: '1px solid red', backgroundColor: 'red', color: 'white' }} type="link" danger onClick={() => showDeleteConfirm(record._id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 10 }}>
        Add Category
      </Button>
      <Table columns={columns} dataSource={categories} loading={loading} rowKey="_id" />

      <Modal title={isEditing ? 'Edit Category' : 'Add Category'} visible={isModalVisible} onOk={handleSubmit(onSubmit)} onCancel={handleCancel}>
        <Form layout="vertical">
          <Form.Item label="Name">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
                  {error && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Image URL">
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
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
