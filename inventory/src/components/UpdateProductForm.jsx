import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
// import { Redirect } from 'react-router-dom';


// const UpdateProductForm = ({ productId }) => {
const UpdateProductForm = () => {
    const { productId } = useParams();
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [buyingDate, setBuyingDate] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [colors, setColors] = useState([]);
  const [links, setLinks] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);


//   console.log(productId);


  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );
        const supplierResponse = await axios.get('http://localhost:5000/api/suppliers');
        const categoryResponse = await axios.get('http://localhost:5000/api/categories');

        const productData = response.data;
        console.log(productData);
        setProductName(productData.productName);
        setProductCode(productData.productCode);
        setProductCategory(productData.productCategory);
        setSupplier(productData.supplier);
        setBuyingPrice(productData.buyingPrice);
        const apiDate = new Date(productData.buyingDate);
        const formattedDate = apiDate.toISOString().split('T')[0];
        setBuyingDate(formattedDate);
        setSellingPrice(productData.sellingPrice);
        setColors(productData.colors);
        setLinks(productData.links);
        setSuppliers(supplierResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    }

    fetchProductDetails();
  }, [productId]);

  const handleAddColor = () => {
    setColors([...colors, { color: "", sizes: [{ size: "", quantity: "" }] }]);
  };

  const handleRemoveColor = (colorIndex) => {
    const updatedColors = colors.filter((_, index) => index !== colorIndex);
    setColors(updatedColors);
  };

  const handleSizeChange = (colorIndex, sizeIndex, field, e) => {
    const updatedColors = [...colors];
    updatedColors[colorIndex].sizes[sizeIndex][field] = e.target.value;
    setColors(updatedColors);
  };
  // const handleImageChange = (imageIndex, field, e) => {
  //   const updatedImages = [...images];
  //   updatedImages[imageIndex][field] = e.target.value;
  //   setImages(updatedImages);
  // };

  const handleAddSize = (colorIndex) => {
    const updatedColors = [...colors];
    updatedColors[colorIndex].sizes.push({ size: "", quantity: "" });
    setColors(updatedColors);
  };
  // const handleAddImage = (imagesIndex) => {
  //   const updatedImages = [...images];
  //   updatedImages[imagesIndex].push({ image: '' });
  //   setImages(updatedImages);
  // };

  const handleRemoveSize = (colorIndex, sizeIndex) => {
    const updatedColors = [...colors];
    updatedColors[colorIndex].sizes.splice(sizeIndex, 1);
    setColors(updatedColors);
  };
  // const handleRemoveImage = (imageIndex) => {
  //   const updatedImages = [...images];
  //   updatedImages[imageIndex].splice(imageIndex, 1);
  //   setImages(updatedImages);
  // };

  //   const handleColorChange = (colorIndex, field, e) => {
  //     const updatedColors = [...colors];
  //     updatedColors[colorIndex][field] = e.target.value;
  //     setColors(updatedColors);
  //   };

  const handleColorChange = (index, event) => {
    const updatedColors = [...colors];
    updatedColors[index].color = event.target.value;
    setColors(updatedColors);
  };

  const handleAddLink = () => {
    setLinks([...links, { link: "" }]);
  };

  const handleRemoveLink = (linkIndex) => {
    const updatedLinks = links.filter((_, index) => index !== linkIndex);
    setLinks(updatedLinks);
  };

  const handleLinkChange = (linkIndex, e) => {
    const updatedLinks = [...links];
    updatedLinks[linkIndex].link = e.target.value;
    setLinks(updatedLinks);
  };

  const handleUpdate = async () => {
    const updatedProductData = {
      productName,
      productCode,
      productCategory,
      supplier,
      buyingPrice,
      buyingDate,
      sellingPrice,
      colors,
      links,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        updatedProductData
      );
      if (response.status === 200) {
        console.log("Product data updated successfully");
        setUpdateSuccess(true);
      } else {
        console.error("Error updating product data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <div>
        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Product Code:</label>
        <input
          type="text"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Product Category:</label>
        <select
  value={productCategory}
  onChange={(e) => setProductCategory(e.target.value)}
  required
>
  <option value="">Select Category</option>
  {categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ))}
</select>
      </div>
      <div>
        <label>Supplier:</label>
        <select
  value={supplier}
  onChange={(e) => setSupplier(e.target.value)}
  required
>
  <option value="">Select Supplier</option>
  {suppliers?.map((supplier) => (
    <option key={supplier.id} value={supplier.id}>
      {supplier.name}
    </option>
  ))}
</select>
      </div>
      <div>
        <label>Buying Price:</label>
        <input
          type="text"
          value={buyingPrice}
          onChange={(e) => setBuyingPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Buying Date:</label>
        <input
          type="date"
          value={buyingDate}
          onChange={(e) => setBuyingDate(e.target.value)}
        />
      </div>
      <div>
        <label>Selling Price:</label>
        <input
          type="text"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />
      </div>

      {/* Render colors and links fields */}
      {colors.map((color, colorIndex) => (
        <div key={colorIndex}>
          <label htmlFor={`color-${colorIndex}`}>Color:</label>
          <input
            type="text"
            id={`color-${colorIndex}`}
            value={color.color}
            onChange={(e) => handleColorChange(colorIndex, e)}
            required
          />
          {/* Render size fields for the color */}
          {color.sizes.map((size, sizeIndex) => (
            <div key={sizeIndex}>
              <label htmlFor={`size-${colorIndex}-${sizeIndex}`}>Size:</label>
              <input
                type="text"
                id={`size-${colorIndex}-${sizeIndex}`}
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(colorIndex, sizeIndex, "size", e)
                }
                required
              />
              <label htmlFor={`quantity-${colorIndex}-${sizeIndex}`}>
                Quantity:
              </label>
              <input
                type="number"
                id={`quantity-${colorIndex}-${sizeIndex}`}
                value={size.quantity}
                onChange={(e) =>
                  handleSizeChange(colorIndex, sizeIndex, "quantity", e)
                }
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveSize(colorIndex, sizeIndex)}
              >
                Remove Size
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddSize(colorIndex)}>
            Add Size
          </button>
          {/* End of rendering size fields */}
          <button type="button" onClick={() => handleRemoveColor(colorIndex)}>
            Remove Color
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddColor}>
        Add Color
      </button>

      {/* Render links fields */}
      {links.map((link, linkIndex) => (
        <div key={linkIndex}>
          <label htmlFor={`link-${linkIndex}`}>Link:</label>
          <input
            type="text"
            id={`link-${linkIndex}`}
            value={link.link}
            onChange={(e) => handleLinkChange(linkIndex, e)}
            required
          />
          <button type="button" onClick={() => handleRemoveLink(linkIndex)}>
            Remove Link
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddLink}>
        Add Link
      </button>

      {/* Render the update button */}
      <button type="button" onClick={handleUpdate}>
        Update Product
      </button>
      {updateSuccess && <Redirect to="/" />}
    </div>
  );
};

export default UpdateProductForm;
