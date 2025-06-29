import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookies';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header';

const OrderDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const userId = Cookies.getItem('userId');

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    quantity: 1,
    paymentMethod: 'COD',
    address: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        user: userId,
        productId,
        quantity: Number(formData.quantity)
      };
      const res = await axios.post('http://localhost:5100/orders', payload);
      if (res.status === 201) {
        alert('Order successful!');
        navigate('/my-orders');
      }
    } catch (err) {
      console.error(err);
      alert('Order failed.');
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit} style={{ padding: '20px', marginTop: '10vh' }}>
        <h2>Complete Your Order</h2>
        {['firstname','lastname','phone','quantity','paymentMethod','address'].map(field => (
          <div key={field} style={{ margin: '10px 0' }}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            {field === 'paymentMethod' ? (
              <select name={field} value={formData[field]} onChange={handleChange}>
                <option>COD</option>
                <option>Online</option>
              </select>
            ) : field === 'quantity' ? (
              <input
                type="number" name={field}
                value={formData[field]} min="1"
                onChange={handleChange} required />
            ) : (
              <input
                type={field==='phone'?'tel':'text'}
                name={field} value={formData[field]}
                onChange={handleChange} required />
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default OrderDetails;
