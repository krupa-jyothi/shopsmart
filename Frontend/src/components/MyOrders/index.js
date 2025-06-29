import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookies';
import styled from 'styled-components';
import Header from '../Header';

// Styled components
const Container = styled.div`
  padding: 20px;
  margin-top: 10vh;
  text-align: start;
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

const OrderList = styled.ul`
  list-style: none;
  padding: 0;
`;

const OrderItem = styled.li`
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
`;

const Strong = styled.strong`
  font-weight: bold;
`;

const MyOrders = () => {
  const userId = Cookies.getItem('userId');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5100/my-orders/${userId}`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, [userId]);

  // Filter orders outside JSX for clarity and performance
  const pendingOrders = orders.filter(order => order.status !== 'Delivered');

  // Optional: Format date to readable form
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Header />
      <Container>
        <Heading className='text-center'>My Orders</Heading>
        <OrderList>
          {pendingOrders.map((order) => (
            <OrderItem key={order._id}>
              <Strong>Order ID:</Strong> {order._id} <br />
              <Strong>Name:</Strong> {order.firstname} {order.lastname} <br />
              <Strong>Phone:</Strong> {order.phone} <br />
              <Strong>Date:</Strong> {formatDate(order.createdAt)} <br />
              <Strong>Price:</Strong> {order.price} <br />
              <Strong>Status:</Strong> {order.status} <br />
              <Strong>Payment Method:</Strong> {order.paymentMethod} <br />
            </OrderItem>
          ))}
        </OrderList>
      </Container>
    </div>
  );
};

export default MyOrders;
