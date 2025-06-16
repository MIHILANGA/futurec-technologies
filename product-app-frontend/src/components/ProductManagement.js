import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ImageUpload from './ImageUpload';

const ManagementContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ProductForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: #6C63FF;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  
  &:hover {
    background: #5A52E0;
  }
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background: #f5f5f5;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const ProductImage = styled.img`
  max-width: 100px;
  max-height: 100px;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:first-of-type {
    background: #48BB78;
    color: white;
  }
  
  &:last-of-type {
    background: #E53E3E;
    color: white;
  }
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('category', formData.category);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category
    });
    setEditingId(product._id);
    setPreview(
      product.image.startsWith('/uploads') 
        ? `http://localhost:5000${product.image}`
        : `http://localhost:5000${product.image}`
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      quantity: '',
      category: ''
    });
    setImageFile(null);
    setEditingId(null);
    setPreview(null);
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <ManagementContainer>
      <h2>Product Management</h2>
      
      <ProductForm onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label>Product Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Category</Label>
            <Input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label>Price ($)</Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <Label>Product Image</Label>
          <ImageUpload 
            onImageChange={handleImageChange} 
            initialImage={preview}
          />
        </FormGroup>
        
        <Button type="submit">
          {editingId ? 'Update Product' : 'Add Product'}
        </Button>
        {editingId && (
          <Button type="button" onClick={resetForm} style={{ marginLeft: '1rem', background: '#718096' }}>
            Cancel
          </Button>
        )}
      </ProductForm>
      
      <h3>Product List</h3>
      <ProductTable>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Quantity</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Image</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <ProductImage 
                  src={product.image.startsWith('/') 
                    ? `http://localhost:5000${product.image}`
                    : product.image
                  }
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'http://localhost:5000/images/default-product.png';
                  }}
                />
              </TableCell>
              <TableCell>
                <ActionButton onClick={() => handleEdit(product)}>
                  Edit
                </ActionButton>
                <ActionButton onClick={() => handleDelete(product._id)}>
                  Delete
                </ActionButton>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </ProductTable>
    </ManagementContainer>
  );
};

export default ProductManagement;