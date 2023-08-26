import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch order list with product details from the database
    async function fetchOrders() {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order List</h1>
      <table>
        <thead>
          <tr>
            <th>Order No</th>
            <th>Customer Name</th>
            <th>Product Name</th>
            <th>Color</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_no}</td>
              <td>{order.customer_name}</td>
              <td>{order.product_name}</td>
              <td>{order.color_name}</td>
              <td>{order.size_name}</td>
              <td>{order.order_quantity}</td>
              <td>{order.amount}</td>
              <td>{order.order_status}</td>
              <Link to={`/orders/${order.id}`}>Order #{order.id}</Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
