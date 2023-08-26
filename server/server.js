const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
// const util = require('util');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventorydb",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

// Temporary storage for categories (replace with a database)
// const categories = [];

// app.post('/api/categories', (req, res) => {
//   const { categoryName } = req.body;
//   if (categoryName) {
//     categories.push(categoryName);
//     res.status(201).json({ message: 'Category added successfully' });
//   } else {
//     res.status(400).json({ error: 'Category name is required' });
//   }
// });

app.post("/api/categories", (req, res) => {
  const { categoryName } = req.body;
  if (categoryName) {
    const insertQuery = "INSERT INTO categories (name) VALUES (?)";
    db.query(insertQuery, [categoryName], (err, result) => {
      if (err) {
        console.error("Database insert error:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(201).json({ message: "Category added successfully" });
      }
    });
  } else {
    res.status(400).json({ error: "Category name is required" });
  }
});

// Endpoint to get categories
app.get("/api/categories", (req, res) => {
  const selectQuery = "SELECT * FROM categories";
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Database select error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

// Endpoint to add a supplier
app.post("/api/suppliers", (req, res) => {
  const { name, phone, address, remark, categories } = req.body;

  if (name.trim() === "") {
    res.status(400).json({ error: "Supplier name is required" });
    return;
  }

  const insertSupplierQuery =
    "INSERT INTO suppliers (name, phone, address, remark) VALUES (?, ?, ?, ?)";

  db.query(
    insertSupplierQuery,
    [name, phone, address, remark],
    (supplierErr, supplierResult) => {
      if (supplierErr) {
        console.error("Supplier insert error:", supplierErr);
        res.status(500).json({ error: "Internal server error" });
      } else {
        const supplierId = supplierResult.insertId;

        const insertSupplierCategoryQuery =
          "INSERT INTO supplier_categories (supplier_id, category_id) VALUES (?, ?)";

        categories.forEach((categoryId) => {
          db.query(
            insertSupplierCategoryQuery,
            [supplierId, categoryId],
            (categoryErr) => {
              if (categoryErr) {
                console.error("Supplier category insert error:", categoryErr);
              }
            }
          );
        });

        res.status(201).json({ message: "Supplier added successfully" });
      }
    }
  );
});

// Endpoint to get all suppliers with category details
app.get("/api/suppliers", (req, res) => {
  const selectSuppliersQuery =
    "SELECT s.id, s.name, s.phone, s.address, s.remark, " +
    "GROUP_CONCAT(DISTINCT c.name) AS categoryNames, GROUP_CONCAT(DISTINCT c.id) AS categoryIds " +
    "FROM suppliers s " +
    "LEFT JOIN supplier_categories sc ON s.id = sc.supplier_id " +
    "LEFT JOIN categories c ON sc.category_id = c.id " +
    "GROUP BY s.id";

  db.query(selectSuppliersQuery, (err, results) => {
    if (err) {
      console.error("Database select error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const suppliersWithCategories = results.map((supplier) => {
        const categoryNames = supplier.categoryNames.split(",");
        const categoryIds = supplier.categoryIds.split(",").map(Number);
        return {
          id: supplier.id,
          name: supplier.name,
          phone: supplier.phone,
          address: supplier.address,
          remark: supplier.remark,
          categories: categoryNames.map((categoryName, index) => ({
            id: categoryIds[index],
            name: categoryName,
          })),
        };
      });

      res.json(suppliersWithCategories);
    }
  });
});

// Endpoint to add a color
app.post("/api/colors", (req, res) => {
  const { name } = req.body;

  if (name.trim() === "") {
    res.status(400).json({ error: "Color name is required" });
    return;
  }

  const insertColorQuery = "INSERT INTO colors (name) VALUES (?)";

  db.query(insertColorQuery, [name], (err) => {
    if (err) {
      console.error("Color insert error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ message: "Color added successfully" });
    }
  });
});

// Endpoint to get colors
app.get("/api/colors", (req, res) => {
  const selectColorsQuery = "SELECT * FROM colors";

  db.query(selectColorsQuery, (err, results) => {
    if (err) {
      console.error("Database select error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

// Endpoint to add a size
app.post("/api/sizes", (req, res) => {
  const { name } = req.body;

  if (name.trim() === "") {
    res.status(400).json({ error: "Size name is required" });
    return;
  }

  const insertSizeQuery = "INSERT INTO sizes (name) VALUES (?)";

  db.query(insertSizeQuery, [name], (err) => {
    if (err) {
      console.error("Size insert error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ message: "Size added successfully" });
    }
  });
});

// Endpoint to get sizes
app.get("/api/sizes", (req, res) => {
  const selectSizesQuery = "SELECT * FROM sizes";

  db.query(selectSizesQuery, (err, results) => {
    if (err) {
      console.error("Database select error:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
});

// Endpoint for handling product form data
app.post("/api/products", (req, res) => {
  const {
    productName,
    productCode,
    productCategory,
    supplier,
    buyingPrice,
    buyingDate,
    sellingPrice,
    colors,
    links,
  } = req.body;

  // Insert product data into products table
  const productQuery =
    "INSERT INTO products (productName, productCode, productCategory, supplier_id, buyingPrice, buyingDate, sellingPrice) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    productQuery,
    [
      productName,
      productCode,
      productCategory,
      supplier,
      buyingPrice,
      buyingDate,
      sellingPrice,
    ],
    (productErr, productResult) => {
      if (productErr) {
        console.error("Error inserting product data:", productErr);
        res
          .status(500)
          .json({ error: "An error occurred while inserting product data" });
        return;
      }

      const productId = productResult.insertId;

      // Insert color, size, and quantity data into respective tables
      colors.forEach((color) => {
        const colorQuery = "INSERT INTO colors (color) VALUES (?)";
        db.query(colorQuery, [color.color], (colorErr, colorResult) => {
          if (colorErr) {
            console.error("Error inserting color data:", colorErr);
            return;
          }

          const colorId = colorResult.insertId;

          color.sizes.forEach((size) => {
            const sizeQuery = "INSERT INTO sizes (size) VALUES (?)";
            db.query(sizeQuery, [size.size], (sizeErr, sizeResult) => {
              if (sizeErr) {
                console.error("Error inserting size data:", sizeErr);
                return;
              }

              const sizeId = sizeResult.insertId;

              const quantityQuery =
                "INSERT INTO quantities (sizeId, quantity) VALUES (?, ?)";
              db.query(
                quantityQuery,
                [sizeId, size.quantity],
                (quantityErr, quantityResult) => {
                  if (quantityErr) {
                    console.error(
                      "Error inserting quantity data:",
                      quantityErr
                    );
                    return;
                  }

                  //   }
                  // );
                  const quantityId = quantityResult.insertId;

                  const productVariationQuery =
                    "INSERT INTO product_variations (product_id, color_id, size_id, quantity_id) VALUES (?, ?, ?, ?)";
                  db.query(
                    productVariationQuery,
                    [productId, colorId, sizeId, quantityId],
                    (variationErr) => {
                      if (variationErr) {
                        console.error(
                          "Error inserting product variation data:",
                          variationErr
                        );
                      }
                    }
                  );
                }
              );
            });
          });
        });
      });

      // Insert link data into links table
      links.forEach((link) => {
        const linkQuery = "INSERT INTO links (product_id, link) VALUES (?, ?)";
        db.query(linkQuery, [productId, link.link], (linkErr) => {
          if (linkErr) {
            console.error("Error inserting link data:", linkErr);
          }
        });
      });

      res.status(200).json({ message: "Product data submitted successfully" });
    }
  );
});
//post product working

app.get("/api/products", async (req, res) => {
  try {
    const productsQuery = `
      SELECT p.id AS productId, p.productName, p.productCode, p.productCategory,
             s.name AS supplierName, p.buyingPrice, p.buyingDate, p.sellingPrice,
             pv.id AS productVariationId, pv.color_id AS colorId, c.color,
             sz.id AS sizeId, sz.size, qty.quantity,
             l.link 
      FROM products p
      INNER JOIN suppliers s ON p.supplier_id = s.id
      INNER JOIN product_variations pv ON pv.product_id = p.id
      INNER JOIN colors c ON c.id = pv.color_id
      INNER JOIN sizes sz ON sz.id = pv.size_id
      LEFT JOIN quantities qty ON qty.id = pv.quantity_id
      RIGHT JOIN links l ON l.product_id = p.id
    `;

    db.query(productsQuery, (error, productsResult) => {
      if (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An error occurred" });
      } else {
        const products = [];
        let currentProduct = null;
        let currentColor = null;
        let currentLink = null;

        productsResult?.forEach((row) => {
          if (!currentProduct || currentProduct.id !== row.productId) {
            currentProduct = {
              id: row.productId,
              productName: row.productName,
              productCode: row.productCode,
              productCategory: row.productCategory,
              supplierName: row.supplierName,
              buyingPrice: row.buyingPrice,
              buyingDate: row.buyingDate,
              sellingPrice: row.sellingPrice,
              links: [],
              details: [],
            };
            products.push(currentProduct);
          }

          if (!currentLink || currentLink.id !== row.link) {
            currentLink = {
              id: row.id,
              link: row.link,
            };
            console.log(currentLink);
            currentProduct.links.push(currentLink);
          }

          if (!currentColor || currentColor.id !== row.colorId) {
            currentColor = {
              id: row.colorId,
              color: row.color,
              sizes: [],
            };
            currentProduct.details.push(currentColor);
          }

          currentColor.sizes.push({
            id: row.sizeId,
            size: row.size,
            quantity: row.quantity,
          });
        });

        res.status(200).json({ products });
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

//get product end

//get single product
app.get("/api/products/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const productQuery = `
  SELECT p.id AS productId, p.productName, p.productCode, p.productCategory,
         s.id AS supplierId, p.buyingPrice, p.buyingDate, p.sellingPrice,
         pv.id AS productVariationId, pv.color_id AS colorId, c.color,
         sz.id AS sizeId, sz.size, qty.id AS quantityId, qty.quantity,
         l.id AS linkId, l.link
  FROM products p
  INNER JOIN suppliers s ON p.supplier_id = s.id
  INNER JOIN product_variations pv ON pv.product_id = p.id
  INNER JOIN colors c ON c.id = pv.color_id
  INNER JOIN sizes sz ON sz.id = pv.size_id
  LEFT JOIN quantities qty ON qty.id = pv.quantity_id
  LEFT JOIN links l ON l.product_id = p.id
  WHERE p.id = ?
`;

    db.query(productQuery, [productId], (error, productResult) => {
      const productName = productResult.productName;
      if (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An error occurred" });
      } else {
        const productData = {
          id: productId,
          productName: productResult[0]?.productName,
          productCode: productResult[0]?.productCode,
          productCategory: productResult[0]?.productCategory,
          supplier: productResult[0]?.supplierId,
          buyingPrice: productResult[0]?.buyingPrice,
          buyingDate: productResult[0]?.buyingDate,
          sellingPrice: productResult[0]?.sellingPrice,
          colors: [],
          links: [],
        };

        // Organize color, size, quantity data
        productResult.forEach((row) => {
          const colorData = productData.colors.find(
            (color) => color.id === row.colorId
          );

          if (!colorData) {
            const newColor = {
              id: row.colorId,
              color: row.color,
              sizes: [],
            };
            productData.colors.push(newColor);
          }

          if (colorData) {
            const sizeData = {
              id: row.sizeId,
              size: row.size,
              quantity: row.quantity,
            };
            colorData.sizes.push(sizeData);
          }

          // const sizeData = {
          //   id: row.sizeId,
          //   size: row.size,
          //   quantity: row.quantity,
          // };
          // colorData.sizes.push(sizeData);

          // Check if the link already exists in the productData links array
          const linkExists = productData.links.some(
            (link) => link.id === row.linkId
          );
          if (!linkExists && row.linkId && row.link) {
            const newLink = {
              id: row.linkId,
              link: row.link,
            };
            productData.links.push(newLink);
          }
        });

        res.status(200).json(productData);
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// get method of a single product is done

// put method of the update form
app.put("/api/products/:productId", (req, res) => {
  const productId = req.params.productId;
  const {
    productName,
    productCode,
    productCategory,
    supplier,
    buyingPrice,
    buyingDate,
    sellingPrice,
    colors,
    links,
  } = req.body;

  const updateProductQuery = `
    UPDATE products
    SET productName = ?, productCode = ?, productCategory = ?, supplier_id = ?, buyingPrice = ?, buyingDate = ?, sellingPrice = ?
    WHERE id = ?
  `;

  db.query(
    updateProductQuery,
    [
      productName,
      productCode,
      productCategory,
      supplier,
      buyingPrice,
      buyingDate,
      sellingPrice,
      productId,
    ],
    (productErr, productResult) => {
      if (productErr) {
        console.error("Error updating product data:", productErr);
        res
          .status(500)
          .json({ error: "An error occurred while updating product data" });
        return;
      }

      const deleteProductVariationsQuery = `
        DELETE FROM product_variations
        WHERE product_id = ?
      `;

      db.query(deleteProductVariationsQuery, [productId], (deleteErr) => {
        if (deleteErr) {
          console.error("Error deleting product variations:", deleteErr);
          res
            .status(500)
            .json({ error: "An error occurred while updating product data" });
          return;
        }

        // Re-insert color, size, and quantity data for the updated product
        colors.forEach((color) => {
          const insertColorQuery = "INSERT INTO colors (color) VALUES (?)";
          db.query(insertColorQuery, [color.color], (colorErr, colorResult) => {
            if (colorErr) {
              console.error("Error inserting color data:", colorErr);
              return;
            }

            const colorId = colorResult.insertId;

            color.sizes.forEach((size) => {
              const insertSizeQuery = "INSERT INTO sizes (size) VALUES (?)";
              db.query(insertSizeQuery, [size.size], (sizeErr, sizeResult) => {
                if (sizeErr) {
                  console.error("Error inserting size data:", sizeErr);
                  return;
                }

                const sizeId = sizeResult.insertId;

                const insertQuantityQuery =
                  "INSERT INTO quantities (sizeId, quantity) VALUES (?, ?)";
                db.query(
                  insertQuantityQuery,
                  [sizeId, size.quantity],
                  (quantityErr, quantityResult) => {
                    if (quantityErr) {
                      console.error(
                        "Error inserting quantity data:",
                        quantityErr
                      );
                      return;
                    }

                    const quantityId = quantityResult.insertId;

                    const insertProductVariationQuery = `
                    INSERT INTO product_variations (product_id, color_id, size_id, quantity_id)
                    VALUES (?, ?, ?, ?)
                  `;
                    db.query(
                      insertProductVariationQuery,
                      [productId, colorId, sizeId, quantityId],
                      (variationErr) => {
                        if (variationErr) {
                          console.error(
                            "Error inserting product variation data:",
                            variationErr
                          );
                        }
                      }
                    );
                  }
                );
              });
            });
          });
        });

        // Update link data for the updated product
        const deleteLinksQuery = `
          DELETE FROM links
          WHERE product_id = ?
        `;
        db.query(deleteLinksQuery, [productId], (deleteLinksErr) => {
          if (deleteLinksErr) {
            console.error("Error deleting links:", deleteLinksErr);
            res
              .status(500)
              .json({ error: "An error occurred while updating product data" });
            return;
          }

          links.forEach((link) => {
            const insertLinkQuery =
              "INSERT INTO links (product_id, link) VALUES (?, ?)";
            db.query(insertLinkQuery, [productId, link.link], (linkErr) => {
              if (linkErr) {
                console.error("Error inserting link data:", linkErr);
              }
            });
          });

          res
            .status(200)
            .json({ message: "Product data updated successfully" });
        });
      });
    }
  );
});

// put method finish

// get request for size
// app.get("/api/sizes/:colorId", async (req, res) => {
//   const colorId = req.params.colorId;

//   try {
//     const sizesQuery = `SELECT s.id, s.size FROM sizes s INNER JOIN product_variations pv ON s.id = pv.size_id WHERE pv.color_id = ?`;

//     db.query(sizesQuery, [colorId], (error, sizesResult) => {
//       res.json({ sizesResult });
//     });
//     // get end size
//   } catch (error) {
//     console.error("Error fetching sizes:", error);
//     res.status(500).json({ error: "An error occurred while fetching sizes" });
//   }
// });

// get request for size with quantity
app.get("/api/sizes/:colorId", async (req, res) => {
  const colorId = req.params.colorId;

  try {
    const sizesQuery = `
      SELECT s.id, s.size, q.quantity
      FROM sizes s
      INNER JOIN product_variations pv ON s.id = pv.size_id
      INNER JOIN quantities q ON pv.quantity_id = q.id
      WHERE pv.color_id = ?`;

    db.query(sizesQuery, [colorId], (error, sizesResult) => {
      if (error) {
        console.error("Error fetching sizes:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching sizes" });
      } else {
        res.json({ sizesResult });
      }
    });
  } catch (error) {
    console.error("Error fetching sizes:", error);
    res.status(500).json({ error: "An error occurred while fetching sizes" });
  }
});

// order posting
// app.post('/api/place-order', async (req, res) => {
//   const orderData = req.body;

//   try {
//     // Insert order data into orders table
//     const insertOrderResult = await db.query(
//       "INSERT INTO orders (order_no, invoice_no, date, customer_name, address, mobile_number, payment_method, payment_status, transaction_id, amount, bkash_mobile_number, courier_provider, courier_date, courier_status, courier_tracking_number, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       [
//         orderData.orderNo,
//         orderData.invoiceNo,
//         orderData.date,
//         orderData.customerName,
//         orderData.address,
//         orderData.mobileNumber,
//         orderData.paymentMethod,
//         orderData.paymentStatus,
//         orderData.transactionId,
//         orderData.amount,
//         orderData.bkashMobileNumber,
//         orderData.courierProvider,
//         orderData.courierDate,
//         orderData.courierStatus,
//         orderData.courierTrackingNumber,
//         orderData.orderStatus,
//       ]
//     );
//     const orderId = insertOrderResult.insertId;
//     console.log("orderId = ");
//     console.log(insertOrderResult);

//     const selectedProduct = orderData.selectedProduct;
//     const { productId, colorId, sizeId, quantity } = selectedProduct;

//     // Get the quantity_id from product_variations table
//     const getProductVariationQuery =
//       "SELECT quantity_id FROM product_variations WHERE product_id = ? AND color_id = ? AND size_id = ?";

//     const productVariationResult = await new Promise((resolve, reject) => {
//       db.query(getProductVariationQuery, [productId, colorId, sizeId], (error, results) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(results[0]);
//         }
//       });
//     });

//     const { quantity_id: quantityId } = productVariationResult;

//     // Update the quantity in the quantities table
//     await db.query("UPDATE quantities SET quantity = quantity - ? WHERE id = ?", [
//       quantity,
//       quantityId,
//     ]);

//     // Insert product details into order_details table
//     await db.query(
//       "INSERT INTO order_details (order_id, product_id, color_id, size_id, quantity) VALUES (?, ?, ?, ?, ?)",
//       [orderId, productId, colorId, sizeId, quantity]
//     );

//     res.status(200).json({ message: 'Order placed successfully' });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     res.status(500).json({ error: 'An error occurred while placing the order' });
//   }
// });

//order place run but testing another
// app.post("/api/place-order", (req, res) => {
//   const orderData = req.body;

//   // Insert order data into orders table
//   const insertOrderQuery =
//     "INSERT INTO orders (order_no, invoice_no, date, customer_name, address, mobile_number, payment_method, payment_status, transaction_id, amount, bkash_mobile_number, courier_provider, courier_date, courier_status, courier_tracking_number, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   db.query(
//     insertOrderQuery,
//     [
//       orderData.orderNo,
//       orderData.invoiceNo,
//       orderData.date,
//       orderData.customerName,
//       orderData.address,
//       orderData.mobileNumber,
//       orderData.paymentMethod,
//       orderData.paymentStatus,
//       orderData.transactionId,
//       orderData.amount,
//       orderData.bkashMobileNumber,
//       orderData.courierProvider,
//       orderData.courierDate,
//       orderData.courierStatus,
//       orderData.courierTrackingNumber,
//       orderData.orderStatus,
//     ],
//     (insertOrderErr, insertOrderResult) => {
//       if (insertOrderErr) {
//         console.error("Error inserting Order data:", insertOrderErr);
//         res
//           .status(500)
//           .json({ error: "An error occurred while inserting product data" });
//         return;
//       }
//       const selectedProduct = orderData.selectedProduct;
//       const { productId, colorId, sizeId, quantity } = selectedProduct;

//       // Get the quantity_id from product_variations table
//       const getProductVariationQuery =
//         "SELECT quantity_id FROM product_variations WHERE product_id = ? AND color_id = ? AND size_id = ?";

//       const productVariationResult = new Promise((resolve, reject) => {
//         db.query(
//           getProductVariationQuery,
//           [productId, colorId, sizeId],
//           (error, results) => {
//             if (error) {
//               reject(error);
//             } else {
//               console.log("productVariationResult:", results);
//               resolve(results[0]);
//             }
//           }
//         );
//       });

//       const { quantity_id: quantityId } = productVariationResult;
//       console.log("quantityId:", quantityId);
//       console.log("quantity:", quantity);

//       const updateQuantityQuery =
//         "UPDATE quantities SET quantity = quantity - ? WHERE id = ?";
//       db.query(updateQuantityQuery, [quantity, quantityId]);
//       console.log("Quantity updated successfully");

//       // db.query(getProductVariationQuery, [productId, colorId, sizeId], (error, results) => {

//       //   const { quantity_id: quantityId } = results;
//       //   console.log(results);
//       //   // Update the quantity in the quantities table
//       //   db.query("UPDATE quantities SET quantity = quantity - ? WHERE id = ?", [
//       //     quantity,
//       //     quantityId,
//       //   ]);
//       // })

//       // const { quantity_id: quantityId } = productVariationResult;

//       // Get the orderId from the insertId property
//       const orderId = insertOrderResult.insertId;
//       console.log(orderId);
//       //  console.log(util.inspect(insertOrderResult, false, null, true /* enable colors */))

//       // Insert product details into order_details table
//       db.query(
//         "INSERT INTO order_details (order_id, product_id, color_id, size_id, quantity) VALUES (?, ?, ?, ?, ?)",
//         [orderId, productId, colorId, sizeId, quantity]
//       );

//       res.status(200).json({ message: "Order placed successfully", orderId });
//     }
//   );
// });
// order place run but testing another

app.post("/api/place-order", (req, res) => {
  const orderData = req.body;

  // Insert order data into orders table
  const insertOrderQuery =
    "INSERT INTO orders (order_no, invoice_no, date, customer_name, address, mobile_number, payment_method, payment_status, transaction_id, amount, bkash_mobile_number, courier_provider, courier_date, courier_status, courier_tracking_number, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    insertOrderQuery,
    [
      orderData.orderNo,
      orderData.invoiceNo,
      orderData.date,
      orderData.customerName,
      orderData.address,
      orderData.mobileNumber,
      orderData.paymentMethod,
      orderData.paymentStatus,
      orderData.transactionId,
      orderData.amount,
      orderData.bkashMobileNumber,
      orderData.courierProvider,
      orderData.courierDate,
      orderData.courierStatus,
      orderData.courierTrackingNumber,
      orderData.orderStatus,
    ],
    (insertOrderErr, insertOrderResult) => {
      if (insertOrderErr) {
        console.error("Error inserting Order data:", insertOrderErr);
        res
          .status(500)
          .json({ error: "An error occurred while inserting product data" });
        return;
      }

      const selectedProduct = orderData.selectedProduct;
      const { productId, colorId, sizeId, quantity } = selectedProduct;

      // Get the quantity_id from product_variations table
      const getProductVariationQuery =
        "SELECT quantity_id FROM product_variations WHERE product_id = ? AND color_id = ? AND size_id = ?";

      db.query(
        getProductVariationQuery,
        [productId, colorId, sizeId],
        (error, results) => {
          if (error) {
            console.error("Error fetching product variation data:", error);
            res.status(500).json({
              error: "An error occurred while fetching product variation data",
            });
            return;
          }

          const { quantity_id: quantityId } = results[0];

          // Update the quantity in the quantities table
          const updateQuantityQuery =
            "UPDATE quantities SET quantity = quantity - ? WHERE id = ?";
          db.query(
            updateQuantityQuery,
            [quantity, quantityId],
            (updateQuantityErr, updateQuantityResult) => {
              if (updateQuantityErr) {
                console.error("Error updating quantity:", updateQuantityErr);
                res
                  .status(500)
                  .json({ error: "An error occurred while updating quantity" });
                return;
              }

              console.log("Quantity updated successfully");

              // Get the orderId from the insertId property
              const orderId = insertOrderResult.insertId;

              // Insert product details into order_details table
              const insertOrderDetailsQuery =
                "INSERT INTO order_details (order_id, product_id, color_id, size_id, quantity, quantity_id) VALUES (?, ?, ?, ?, ?, ?)";

              db.query(
                insertOrderDetailsQuery,
                [orderId, productId, colorId, sizeId, quantity, quantityId],
                (insertOrderDetailsErr) => {
                  if (insertOrderDetailsErr) {
                    console.error(
                      "Error inserting order details:",
                      insertOrderDetailsErr
                    );
                    res.status(500).json({
                      error: "An error occurred while inserting order details",
                    });
                    return;
                  }

                  res
                    .status(200)
                    .json({ message: "Order placed successfully", orderId });
                }
              );
            }
          );
        }
      );
    }
  );
});

// get order details
app.get("/api/orders", async (req, res) => {
  try {
    const ordersQuery = `
      SELECT
        o.*,
        od.product_id,
        od.color_id,
        od.size_id,
        od.quantity AS order_quantity,
        p.productName AS product_name,
        c.color AS color_name,
        s.size AS size_name
      FROM orders o
      INNER JOIN order_details od ON o.id = od.order_id
      INNER JOIN products p ON od.product_id = p.id
      INNER JOIN colors c ON od.color_id = c.id
      INNER JOIN sizes s ON od.size_id = s.id
      ORDER BY o.id DESC
    `;

    db.query(ordersQuery, (error, ordersResult) => {
      if (error) {
        console.error("Error fetching orders:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching orders" });
      } else {
        res.json({ orders: ordersResult });
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
});
// get order details end

// get single order details
app.get("/api/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Fetch order details including product details
    const getOrderQuery = `
      SELECT 
        o.id AS order_id,
        o.order_no,
        o.invoice_no,
        o.date,
        o.customer_name,
        o.address,
        o.mobile_number,
        o.payment_method,
        o.payment_status,
        o.transaction_id,
        o.amount,
        o.bkash_mobile_number,
        o.courier_provider,
        o.courier_date,
        o.courier_status,
        o.courier_tracking_number,
        o.order_status,
        od.product_id,
        od.color_id,
        od.size_id,
        od.quantity,
        od.quantity_id,
        p.productName,
        c.color,
        s.size
      FROM orders o
      JOIN order_details od ON o.id = od.order_id
      JOIN products p ON od.product_id = p.id
      JOIN colors c ON od.color_id = c.id
      JOIN sizes s ON od.size_id = s.id
      WHERE o.id = ?
    `;

    db.query(getOrderQuery, [orderId], (error, results) => {
      if (error) {
        console.error("Error fetching order details:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching order details" });
      } else {
        const orderData = formatOrderData(results); // Helper function to format data if needed
        res.json({ order: orderData });
      }
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching order details" });
  }
});

// Helper function to format data if needed
function formatOrderData(results) {
  // Implement any necessary formatting or restructuring of the fetched data
  // For example, you might want to group product details under each order
  // Modify this function according to your data structure and formatting needs
  // Example:
  const formattedOrder = {
    order_id: results[0].order_id,
    order_no: results[0].order_no,
    invoice_no: results[0].invoice_no,
    date: results[0].date,
    customer_name: results[0].customer_name,
    address: results[0].address,
    mobile_number: results[0].mobile_number,
    payment_method: results[0].payment_method,
    payment_status: results[0].payment_status,
    transaction_id: results[0].transaction_id,
    amount: results[0].amount,
    bkash_mobile_number: results[0].bkash_mobile_number,
    courier_provider: results[0].courier_provider,
    courier_date: results[0].courier_date,
    courier_status: results[0].courier_status,
    courier_tracking_number: results[0].courier_tracking_number,
    order_status: results[0].order_status,
    product_id: results[0].product_id,
    color_id: results[0].color_id,
    quantity: results[0].quantity,
    quantity_id: results[0].quantity_id,
    productName: results[0].productName,
    color: results[0].color,
    size: results[0].size,
    // ... other order properties
    products: results.map((row) => ({
      product_id: row.product_id,
      color_id: row.color_id,
      size_id: row.size_id,
      quantity: row.quantity,
      product_name: row.product_name,
      color_name: row.color_name,
      size: row.size,
    })),
  };
  return formattedOrder;
}
// Helper function to format data if needed
// get single order details end


// put for update the order details 
app.put("/api/orders/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  const updatedOrderData = req.body;

  try {
    // Update the order details in the database based on the orderId
    const updateOrderQuery = `
      UPDATE orders
      SET
        order_no = ?,
        invoice_no = ?,
        date = ?,
        customer_name = ?,
        address = ?,
        mobile_number = ?,
        payment_method = ?,
        payment_status = ?,
        transaction_id = ?,
        amount = ?,
        bkash_mobile_number = ?,
        courier_provider = ?,
        courier_date = ?,
        courier_status = ?,
        courier_tracking_number = ?,
        order_status = ?,
      WHERE id = ?
    `;

    db.query(
      updateOrderQuery,
      [
        updatedOrderData.order_no,
        updatedOrderData.invoice_no,
        updatedOrderData.date,
        updatedOrderData.customer_name,
        updatedOrderData.address,
        updatedOrderData.mobile_number,
        updatedOrderData.payment_method,
        updatedOrderData.payment_status,
        updatedOrderData.transaction_id,
        updatedOrderData.amount,
        updatedOrderData.bkash_mobile_number,
        updatedOrderData.courier_provider,
        updatedOrderData.courier_date,
        updatedOrderData.courier_status,
        updatedOrderData.courier_tracking_number,
        updatedOrderData.order_status,
        // Add more field values to update here
        orderId
      ],
      (error, updateResult) => {
        if (error) {
          console.error("Error updating order:", error);
          res.status(500).json({ error: "An error occurred while updating the order" });
        } else {
          res.status(200).json({ message: "Order updated successfully" });
        }
      }
    );
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while updating the order" });
  }
});

// put for update the order details end


// // Get the orderId from the insertId property
// const orderId = insertOrderResult.insertId;

// catch (error) {
// console.error('Error placing order:', error);
// res.status(500).json({ error: 'An error occurred while placing the order' });
// }
// });
// order posting end

// ... (rest of the server code)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
