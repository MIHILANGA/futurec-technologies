import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
`;

const RegisterForm = styled.form`
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h2`
  font-family: 'Poppins', sans-serif;
  color: #2D3748;
  text-align: center;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  font-family: 'Open Sans', sans-serif;
  color: #4A5568;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-family: 'Open Sans', sans-serif;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6C63FF;
    box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #6C63FF;
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5A52E0;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #E53E3E;
  font-family: 'Open Sans', sans-serif;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password
      });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <FormTitle>Create Account</FormTitle>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <InputGroup>
          <InputLabel>Username</InputLabel>
          <InputField 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </InputGroup>
        
        <InputGroup>
          <InputLabel>Email</InputLabel>
          <InputField 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </InputGroup>
        
        <InputGroup>
          <InputLabel>Password</InputLabel>
          <InputField 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </InputGroup>
        
        <SubmitButton type="submit">Register</SubmitButton>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;