import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductSelector = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data?.products);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  console.log(products);

  const handleProductChange = (event) => {
    const selectedProductId = event.target.value;
    setSelectedProduct(selectedProductId);
    onSelectProduct(selectedProductId);
  };

  return (
    <div className="w-1/2">
      <label htmlFor="product" className="block text-sm font-semibold leading-6 text-gray-900">Select Product:</label>
      <select
        id="product"
        className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        value={selectedProduct}
        onChange={handleProductChange}
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.productName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSelector;
