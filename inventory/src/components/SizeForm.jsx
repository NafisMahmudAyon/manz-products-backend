// SizeForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SizeForm = () => {
  const [sizeName, setSizeName] = useState('');

  const handleInputChange = (e) => {
    setSizeName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sizeName.trim() === '') {
      alert('Size name is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/sizes/', {
        name: sizeName,
      });

      if (response.status === 201) {
        alert('Size added successfully.');
        setSizeName('');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add New Size</h2>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Size Name:</label>
          <input
            type="text"
            value={sizeName}
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
            Add Size
          </button>
        </div>
      </form>
    </div>
  );
};

export default SizeForm;
