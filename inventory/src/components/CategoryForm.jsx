import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = () => {
  const [categoryName, setCategoryName] = useState('');

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categoryName.trim() === '') {
      alert('Category name is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/categories', {
        categoryName,
      });

      if (response.status === 201) {
        alert('Category added successfully.');
        setCategoryName('');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add New Category</h2>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
