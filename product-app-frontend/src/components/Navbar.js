import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #6C63FF;
  
  span {
    color: #FF6584;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #2D3748;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: #6C63FF;
    
    &::after {
      width: 100%;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #6C63FF;
    transition: width 0.3s ease;
  }
`;

const Navbar = () => {
  return (
    <NavContainer>
      <Logo>futurec<span> technologies
</span></Logo>
      <NavLinks>
        <NavLink to="/">Products</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/manage-products">Product Management</NavLink>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar;