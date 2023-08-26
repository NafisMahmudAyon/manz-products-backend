import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  // const handleEditProduct = (productId) => {
  //   console.log(productId);
  //   // Navigate to the update form route, passing the productId as a parameter
  //   history.push(`/update-product/${productId}`);
  // };
  

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      {products.map((product, index) => (
        <div key={product.id} className="border rounded p-4 mb-4">
          <h2 className="text-xl font-semibold">{index+1}- {product.productName}</h2>
          <p className="mb-2">Product Code: {product.productCode}</p>
          <p className="mb-2">Product Category: {product.productCategory}</p>
          <p className="mb-2">Supplier: {product.supplierName}</p>
          <p className="mb-2">Buying Price: {product.buyingPrice}</p>
          <p className="mb-2">Buying Date: {product.buyingDate}</p>
          <p className="mb-2">Selling Price: {product.sellingPrice}</p>
          {product.details.map((color) => (
            <div key={color.id} className="mt-4">
              <h3 className="text-lg font-semibold">Color: {color.color}</h3>
              {color.sizes.map((size) => (
                <div key={size.id} className="flex items-center">
                  <p className="mr-2">Size: {size.size}</p>
                  <p className="mr-2">Quantity: {size.quantity}</p>
                </div>
              ))}
            </div>
          ))}
          {/* <Link to={`/products/${product.id}/edit`}>Edit</Link> */}
          {/* <button
    onClick={() => handleEditProduct(product.id)}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Edit
  </button> */}
  <Link
    to={`/update-product/${product.id}`}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    Edit
  </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
