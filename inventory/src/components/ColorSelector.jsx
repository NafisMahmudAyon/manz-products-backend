import React, { useState, useEffect } from "react";
import axios from "axios";

const ColorSelector = ({ productId, onSelectColor }) => {
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  console.log(selectedColor);

  useEffect(() => {
    async function fetchColors() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );
        setColors(response.data?.colors);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    }

    if (productId) {
      fetchColors();
    }
  }, [productId]);

  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
    onSelectColor(colorId);
  };

  return (
    <div className="w-1/2">
      <label className="block text-sm font-semibold leading-6 text-gray-900">
        Select Color:
      </label>
      <select
        value={selectedColor}
        className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        onChange={(e) => handleColorSelect(e.target.value)}
      >
        <option value="">Select Color</option>
        {colors.map((color) => (
          <option key={color.id} value={color.id}>
            {color.color}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ColorSelector;
