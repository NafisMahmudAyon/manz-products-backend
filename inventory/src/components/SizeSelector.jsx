// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SizeSelector = ({ productId, colorId, onSelectSize }) => {
//   const [sizeList, setSizeList] = useState([]);
//   console.log(colorId);

//   useEffect(() => {
//     if (productId && colorId) {
//       // Fetch size list based on the selected product and color
//       async function fetchSizes() {
//         try {
//           const response = await axios.get(`http://localhost:5000/api/sizes/${colorId}`);
//           setSizeList(response.data.sizesResult);
//         } catch (error) {
//           console.error('Error fetching sizes:', error);
//         }
//       }

//       fetchSizes();
//     }
//   }, [productId, colorId]);

//   return (
//     <div>
//       <label>Select Size:</label>
//       <select onChange={(e) => onSelectSize(e.target.value)}>
//         <option value="">Select a size</option>
//         {sizeList?.map((size) => (
//           <option key={size.id} value={size.id}>
//             {size.size}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default SizeSelector;

import React, { useState, useEffect } from "react";
import axios from "axios";

const SizeSelector = ({ productId, colorId, onSelectSize }) => {
  const [sizeList, setSizeList] = useState([]);
  console.log(colorId);

  useEffect(() => {
    if (productId && colorId) {
      // Fetch size list based on the selected product and color
      async function fetchSizes() {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/sizes/${colorId}`
          );
          setSizeList(response.data.sizesResult);
        } catch (error) {
          console.error("Error fetching sizes:", error);
        }
      }

      fetchSizes();
    }
  }, [productId, colorId]);

  return (
    <div className="w-1/2">
      <label className="block text-sm font-semibold leading-6 text-gray-900">
        Select Size:
      </label>
      <select
        onChange={(e) => onSelectSize(e.target.value)}
        className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
      >
        <option value="">Select Size</option>
        {sizeList.map((size) => (
          <option key={size.id} value={size.id}>
            {size.size} ({size.quantity})
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeSelector;
