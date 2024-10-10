const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Database configuration
const dbConfig = {
  server: 'PSGST-SHUBHA',
  database: 'Inventory',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: 'PSGST-SHUBHA',
      userName: 'PSG',
      password: 'shubha22',
    }
  }
};

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads'); // Specify your upload directory
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create the directory if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with a unique name
  }
});

const upload = multer({ storage: storage });

// Define the upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  const { name, price, quantity } = req.body;
  const filePath = req.file ? req.file.path : null; // Get the file path

  try {
    // Connect to the database
    const pool = await sql.connect(dbConfig);

    // Insert product details into the database
    const result = await pool.request()
      .input('p_name', sql.VarChar(50), name)
      .input('p_quantity', sql.Decimal(18, 2), price)
      .input('p_price', sql.Int, quantity)
      .input('p_image', sql.VarChar(255), ImageData) // Store the file path in the database
      .execute('AddProduct'); // Your stored procedure for adding the product

    res.status(200).json({
      message: 'Product uploaded successfully!',
      productId: result.recordset[0].ProductID // Assuming the procedure returns the new ProductID
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
