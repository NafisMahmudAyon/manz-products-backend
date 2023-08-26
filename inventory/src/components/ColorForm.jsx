// ColorForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ColorForm = ({ onSelectColor }) => {
  const [colorName, setColorName] = useState('');

  const handleInputChange = (e) => {
    setColorName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (colorName.trim() === '') {
      alert('Color name is required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/colors', {
        name: colorName,
      });

      if (response.status === 201) {
        alert('Color added successfully.');
        setColorName('');
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add New Color</h2>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Color Name:</label>
          <input
            type="text"
            value={colorName}
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
            Add Color
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColorForm;
