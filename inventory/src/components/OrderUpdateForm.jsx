import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderUpdateForm = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    // Fetch order details based on the orderId
    async function fetchOrderDetails() {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrderData(response.data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }

    fetchOrderDetails();
  }, [orderId]);

  const handleUpdateOrder = async () => {
    console.log(orderData);
    // try {
    //   const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, orderData);

    //   if (response.status === 200) {
    //     console.log('Order updated successfully');
    //   } else {
    //     console.error('Error updating order');
    //   }
    // } catch (error) {
    //   console.error('An error occurred:', error);
    // }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setOrderData({ ...orderData, [name]: value });
  };

  return (
    <div>
      <h2>Update Order</h2>
      {/* Render form fields */}
      <div>
        <label>Customer Name:</label>
        <input
          type="text"
          name="customer_name"
          value={orderData.customer_name}
          onChange={handleInputChange}
        />
      </div>
      {/* Add more form fields here based on your order data */}
      
      <button type="button" onClick={handleUpdateOrder}>
        Update Order
      </button>
    </div>
  );
};

export default OrderUpdateForm;
