import React, { useState, useEffect } from "react";
import axios from "axios";

import ProductSelector from "./ProductSelector";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";

const OrderForm = () => {
  const [orderData, setOrderData] = useState({
    orderNo: "",
    invoiceNo: "",
    date: "",
    customerName: "",
    address: "",
    mobileNumber: "",
    paymentMethod: "",
    paymentStatus: "",
    transactionId: "",
    amount: "",
    bkashMobileNumber: "",
    courierProvider: "",
    courierDate: "",
    courierStatus: "",
    courierTrackingNumber: "",
    orderStatus: "",
    selectedProduct: {
      productId: "",
      colorId: "",
      sizeId: "",
      quantity: "",
    },
  });

  const [productList, setProductList] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [sizeList, setSizeList] = useState([]);

  useEffect(() => {
    // Fetch product list from the database
    async function fetchProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProductList(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleProductSelect = async (productId) => {
    // Fetch color list based on selected product
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${productId}`
      );
      setColorList(response.data.colors);
    } catch (error) {
      console.error("Error fetching colors:", error);
    }

    // Update selected product's ID
    setOrderData({
      ...orderData,
      selectedProduct: { ...orderData.selectedProduct, productId },
    });
  };
  console.log(orderData);

  const handleColorSelect = async (colorId) => {
    // Fetch size list based on selected product and color
    try {
      console.log(colorId);
      const response = await axios.get(
        `http://localhost:5000/api/sizes/${colorId}`
      );
      setSizeList(response.data.sizes);
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }

    // Update selected product's color ID
    setOrderData({
      ...orderData,
      selectedProduct: { ...orderData.selectedProduct, colorId },
    });
  };

  const handleSizeSelect = (sizeId) => {
    // Update selected product's size ID
    setOrderData({
      ...orderData,
      selectedProduct: { ...orderData.selectedProduct, sizeId },
    });
  };

  const handleQuantityChange = (quantity) => {
    // Update selected product's quantity
    setOrderData({
      ...orderData,
      selectedProduct: { ...orderData.selectedProduct, quantity },
    });
  };

  const handlePlaceOrder = async () => {
    // Send the selected order data to the backend
    console.log(orderData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/place-order",
        orderData
      );

      if (response.status === 200) {
        console.log("Order placed successfully");
        // Deduct the selected product's quantity from the inventory
        // Update the product's quantity in the database
      } else {
        console.error("Error placing order");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto mt-16 max-w-xl sm:mt-20 border p-2 rounded-md mb-6 ">
        {/* Render order form fields */}
        <div className="mx-auto mt-16 max-w-xl sm:mt-20 border p-2 rounded-md mb-6 ">
          {/* order details  */}
          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Order Number:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.orderNo}
                onChange={(e) =>
                  setOrderData({ ...orderData, orderNo: e.target.value })
                }
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Invoice Number:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.invoiceNo}
                onChange={(e) =>
                  setOrderData({ ...orderData, invoiceNo: e.target.value })
                }
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Date:
              </label>
              <input
                type="date"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.date}
                onChange={(e) =>
                  setOrderData({ ...orderData, date: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Customer Name:
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={orderData.customerName}
              onChange={(e) =>
                setOrderData({ ...orderData, customerName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Address:
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={orderData.address}
              onChange={(e) =>
                setOrderData({ ...orderData, address: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Mobile Number:
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={orderData.mobileNumber}
              onChange={(e) =>
                setOrderData({ ...orderData, mobileNumber: e.target.value })
              }
            />
          </div>
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Payment Method:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.paymentMethod}
                onChange={(e) =>
                  setOrderData({ ...orderData, paymentMethod: e.target.value })
                }
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Payment Status:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.paymentStatus}
                onChange={(e) =>
                  setOrderData({ ...orderData, paymentStatus: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Transaction Id:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.transactionId}
                onChange={(e) =>
                  setOrderData({ ...orderData, transactionId: e.target.value })
                }
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Amount:
              </label>
              <input
                type="number"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.amount}
                onChange={(e) =>
                  setOrderData({ ...orderData, amount: e.target.value })
                }
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Bkash Mobile Number:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.bkashMobileNumber}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    bkashMobileNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Courier Provider:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.courierProvider}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    courierProvider: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Courier Date:
              </label>
              <input
                type="date"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.courierDate}
                onChange={(e) =>
                  setOrderData({ ...orderData, courierDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Courier Status:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.courierStatus}
                onChange={(e) =>
                  setOrderData({ ...orderData, courierStatus: e.target.value })
                }
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Courier Tracking Number:
              </label>
              <input
                type="text"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.courierTrackingNumber}
                onChange={(e) =>
                  setOrderData({
                    ...orderData,
                    courierTrackingNumber: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Order Status:
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={orderData.orderStatus}
              onChange={(e) =>
                setOrderData({ ...orderData, orderStatus: e.target.value })
              }
            />
          </div>
        </div>
        {/* ... */}
        <div className="border p-2 rounded-md mb-6 ">
          <div className="flex gap-3 mb-6">
            {/* Select Product */}
            <ProductSelector onSelectProduct={handleProductSelect} />

            {/* Select Color */}
            <ColorSelector
              productId={orderData.selectedProduct.productId}
              onSelectColor={handleColorSelect}
            />
          </div>

          {/* Select Size */}
          {/* <SizeSelector
        productId={orderData.selectedProduct.productId}
        colorId={orderData.selectedProduct.colorId}
        onSelectSize={handleSizeSelect}
      /> */}
          <div className="flex gap-3">
            <SizeSelector
              productId={orderData.selectedProduct.productId}
              colorId={orderData.selectedProduct.colorId}
              sizeList={sizeList} // Pass the sizeList prop here
              onSelectSize={handleSizeSelect}
            />

            {/* Quantity Input */}
            <div className="w-1/2">
              <label className="block text-sm font-semibold leading-6 text-gray-900">
                Quantity:
              </label>
              <input
                type="number"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={orderData.selectedProduct.quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          type="button"
          className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
