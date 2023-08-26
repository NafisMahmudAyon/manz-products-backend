import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"


const ProductForm = () => {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [buyingDate, setBuyingDate] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [colors, setColors] = useState([
    { color: "", sizes: [{ size: "", quantity: "" }] },
  ]);
  // const [images, setImages] = useState([{ images: [{ image: '' }] }]);
  const [links, setLinks] = useState([{ link: "" }]);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [colorList, setColorList] = useState([]);
  const [sizeList, setSizeList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:5000/api/categories"
        );
        const supplierResponse = await axios.get(
          "http://localhost:5000/api/suppliers"
        );
        const colorResponse = await axios.get(
          "http://localhost:5000/api/colors"
        );
        const sizeResponse = await axios.get("http://localhost:5000/api/sizes");

        setCategories(categoryResponse.data);
        setSuppliers(supplierResponse.data);
        setColorList(colorResponse.data);
        setSizeList(sizeResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

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

  const handleSubmit = async () => {
    const productData = {
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
    console.log(productData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        productData
      );
      //   console.log(productData);

      if (response.status === 200) {
        console.log("Product data submitted successfully");
      } else {
        console.error("Error submitting product data");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  console.log(colors);

  return (
    <Card className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <h2 className="text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl">Product Add</h2>
      <CardContent>

      <div className="mx-auto mt-16 max-w-xl sm:mt-20 border p-2 rounded-md mb-6 ">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Product Name:
            </label>
            <Input
              type="text"
              placeholder="Product Name"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Product Code:
            </label>
            <Input
              type="text"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={productCode}
              placeholder="Enter Product Code"
              onChange={(e) => setProductCode(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Product Category:
            </label>
            <select
              value={productCategory}
              className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
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
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Supplier:
            </label>
            <select
              value={supplier}
              className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              onChange={(e) => setSupplier(e.target.value)}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3 mb-6">
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Buying Price:
            </label>
            <Input
              type="text"
              placeholder="Buying Price"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Buying Date:
            </label>
            <Input
              type="date"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={buyingDate}
              onChange={(e) => setBuyingDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold leading-6 text-gray-900">
              Selling Price:
            </label>
            <Input
              type="text"
              placeholder="Selling Price"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6 border p-2 rounded-md  ">
          {links.map((link, linkIndex) => (
            <div key={linkIndex} className="mb-2">
              <label
                htmlFor={`link-${linkIndex}`}
                className="block text-sm font-semibold leading-6 text-gray-900"
              >
                Image Link {linkIndex + 1}:
              </label>
              <div className="flex gap-3">
                <Input
                  type="text"
                  className="block w-3/4 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  id={`link-${linkIndex}`}
                  value={link.link}
                  onChange={(e) => handleLinkChange(linkIndex, e)}
                  required
                />
                <button
                  type="button"
                  className="block w-1/4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => handleRemoveLink(linkIndex)}
                >
                  Remove Link
                </button>
              </div>
             </div>
          ))}
          <button
            type="button"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddLink}
          >
            Add Link
          </button>
        </div>

        <div className="border p-2 rounded-md mb-6 ">
          <div className="mb-6 ">
            {colors.map((color, colorIndex) => (
              <div key={colorIndex} className=" border p-2 rounded-md mb-6 ">
                <label
                  htmlFor={`color-${colorIndex}`}
                  className="block text-sm font-semibold leading-6 text-gray-900"
                >
                  Color:
                </label>
                <div className="flex gap-3 mb-6 ">
                  <Input
                    type="text"
                    className="block w-3/4 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id={`color-${colorIndex}`}
                    value={color.color}
                    onChange={(e) => handleColorChange(colorIndex, e)}
                    required
                  />
                  <button
                    type="button"
                    className="block w-1/4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => handleRemoveColor(colorIndex)}
                  >
                    Remove Color
                  </button>
                </div>

                <div className="mb-6">
                  {color.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex gap-2 md-6 ">
                      <div className="flex w-1/3 flex-col ">
                        <label
                          className="block text-sm font-semibold leading-6 text-gray-900"
                          htmlFor={`size-${colorIndex}-${sizeIndex}`}
                        >
                          Size:
                        </label>
                        <Input
                          type="text"
                          className="block w-3/4 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          id={`size-${colorIndex}-${sizeIndex}`}
                          value={size.size}
                          onChange={(e) =>
                            handleSizeChange(colorIndex, sizeIndex, "size", e)
                          }
                          required
                        />
                      </div>
                      <div className="flex w-1/3 flex-col">
                        <label
                          htmlFor={`quantity-${colorIndex}-${sizeIndex}`}
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Quantity:
                        </label>
                        <Input
                          type="number"
                          className="block w-3/4 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          id={`quantity-${colorIndex}-${sizeIndex}`}
                          value={size.quantity}
                          onChange={(e) =>
                            handleSizeChange(
                              colorIndex,
                              sizeIndex,
                              "quantity",
                              e
                            )
                          }
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className="block w-1/3 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => handleRemoveSize(colorIndex, sizeIndex)}
                      >
                        Remove Size
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => handleAddSize(colorIndex)}
                >
                  Add Size
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleAddColor}
          >
            Add Color
          </button>
        </div>
        <button type="button" className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
