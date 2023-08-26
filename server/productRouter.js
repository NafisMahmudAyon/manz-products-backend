const express = require('express');
const router = express.Router();
const db = require('./db'); // Assuming you have a db.js file for database connection

// Endpoint for adding a new product
router.post('/', async (req, res) => {
  const { productName, productCode, productCategory, supplier, buyingPrice, buyingDate, sellingPrice, colors } = req.body;

  try {
    // Insert the product details into the products table
    const productInsertQuery = `
      INSERT INTO products (productName, productCode, productCategory, supplier, buyingPrice, buyingDate, sellingPrice)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const productValues = [productName, productCode, productCategory, supplier, buyingPrice, buyingDate, sellingPrice];
    const productResult = await db.query(productInsertQuery, productValues);
    const productId = productResult.insertId;

    // Insert product variations into the product_variations table
    for (const color of colors) {
      const colorId = color.colorId;
      for (const size of color.sizes) {
        const sizeId = size.sizeId;
        const quantityId = size.quantityId;
        
        const variationInsertQuery = `
          INSERT INTO product_variations (product_id, color_id, size_id, quantity_id)
          VALUES (?, ?, ?, ?)
        `;
        const variationValues = [productId, colorId, sizeId, quantityId];
        await db.query(variationInsertQuery, variationValues);
      }
    }

    res.status(200).json({ message: 'Product data added successfully' });
  } catch (error) {
    console.error('Error adding product data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
