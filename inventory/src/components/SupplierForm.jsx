// SupplierForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    remark: '',
    selectedCategories: [],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategorySelect = (categoryId) => {
    if (formData.selectedCategories.includes(categoryId)) {
      setFormData((prevData) => ({
        ...prevData,
        selectedCategories: prevData.selectedCategories.filter(
          (id) => id !== categoryId
        ),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        selectedCategories: [...prevData.selectedCategories, categoryId],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, phone, address, remark, selectedCategories } = formData;

    if (name.trim() === '') {
      alert('Supplier name is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/suppliers', {
        name,
        phone,
        address,
        remark,
        categories: selectedCategories,
      });

      if (response.status === 201) {
        alert('Supplier added successfully.');
        setFormData({
          name: '',
          phone: '',
          address: '',
          remark: '',
          selectedCategories: [],
        });
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <h2 className="text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl">Add New Supplier</h2>
      <form className="mx-auto mt-16 max-w-xl sm:mt-20 border p-2 rounded-md mb-6 " onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold leading-6 text-gray-900">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold leading-6 text-gray-900">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold leading-6 text-gray-900">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold leading-6 text-gray-900">Remark:</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleInputChange}
            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold leading-6 text-gray-900">Categories:</label>
          <div className="flex flex-wrap">
            {categories.map((category) => (
              <label
                key={category.id}
                className="inline-block bg-gray-200 px-2 py-1 rounded-md mr-2 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.selectedCategories.includes(category.id)}
                  onChange={() => handleCategorySelect(category.id)}
                  className="mr-1 bg-slate-400 text-sm font-semibold leading-6 text-gray-900"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Supplier
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierForm;
