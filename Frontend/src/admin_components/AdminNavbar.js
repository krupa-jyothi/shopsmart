// src/components/Navbar.js

import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

const Unavbar = () => {
  const get = localStorage.getItem('user');

  return (
    <Navbar className='bg-green-400' variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to='/uhome' style={{ color: "white", textDecoration: "none" }}>Grocery Web App</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link to="/Admin/dashboard" style={navLinkStyle}>Dashboard</Link>
            <Link to="/admin/users" style={navLinkStyle}>Users</Link>
            <Link to="/admin/all-products" style={navLinkStyle}>Products</Link>
            <Link to="/admin/add-product" style={navLinkStyle}>Add product</Link>
            <Link to="/admin/orders" style={navLinkStyle}>Orders</Link>
            <Link to="/" style={navLinkStyle}>Logout</Link>

            {/* ✅ Use the 'get' variable safely */}
            {get && (
              <h4 style={{ color: "white", paddingTop: "4px", marginLeft: "10px" }}>
                ({JSON.parse(get).name})
              </h4>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Extracted style object for better readability
const navLinkStyle = {
  padding: "8px",
  color: "white",
  textDecoration: "none",
  fontSize: "22px",
  fontStyle: "italic"
};

export default Unavbar;
