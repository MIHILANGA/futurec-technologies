import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  color: #2D3748;
  font-size: 2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  font-family: 'Open Sans', sans-serif;
  color: #4A5568;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  font-family: 'Open Sans', sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #6C63FF;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f5f5f5;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-family: 'Poppins', sans-serif;
  color: #2D3748;
  margin-bottom: 0.5rem;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.span`
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  color: #6C63FF;
`;

const ProductQuantity = styled.span`
  font-family: 'Open Sans', sans-serif;
  color: #4A5568;
`;

const ProductCategory = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #E9D8FD;
  color: #6B46C1;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #4A5568;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #E53E3E;
`;

const DEFAULT_IMAGE = '/images/default-product.png';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        
        const uniqueCategories = [...new Set(response.data.map(p => p.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE;
  };

  if (loading) return <LoadingMessage>Loading products...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Header>
        <Title>Our Products</Title>
        <FilterContainer>
          <FilterLabel>Filter:</FilterLabel>
          <FilterSelect 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </FilterSelect>
        </FilterContainer>
      </Header>

      <ProductGrid>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product._id}>
              <ProductImage 
                src={product.image || DEFAULT_IMAGE}
                alt={product.name}
                onError={handleImageError}
              />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductMeta>
                  <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                  <ProductQuantity>{product.quantity} in stock</ProductQuantity>
                </ProductMeta>
                <ProductCategory>{product.category}</ProductCategory>
              </ProductInfo>
            </ProductCard>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            No products found in this category.
          </div>
        )}
      </ProductGrid>
    </Container>
  );
};

export default ProductList;