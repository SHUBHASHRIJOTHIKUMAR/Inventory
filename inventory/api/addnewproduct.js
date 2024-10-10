const express = require('express');
const multer = require('multer');
const sql = require('mssql');

const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Add Product API
router.post('/addproduct', upload.single('image'), async (req, res) => {
    const { name, quantity, price } = req.body;
    const imageData = req.file ? req.file.buffer : null; // Handle uploaded image data

    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    try {
        if (!name || !quantity || !price) {
            return res.status(400).json({ message: 'Name, quantity, and price are required.' });
        }

        // Database logic here...
        const request = new sql.Request();
        await request.input('p_name', sql.VarChar, name)
            .input('p_quantity', sql.Int, quantity)
            .input('p_price', sql.Decimal(10, 2), price)
            .input('p_image', sql.VarBinary, imageData) // Pass imageData here
            .execute('AddStock'); // Your stored procedure name

        res.status(200).json({ message: 'Product added successfully!' });
    } catch (error) {
        console.error('Error adding stock:', error);
        res.status(500).json({ message: 'Failed to add product.', error: error.message });
    }
});

// Fetch Products API
router.get('/stock', async (req, res) => {
    try {
        const pool = await sql.connect(/* your config */);
        const result = await pool.request().query('SELECT * FROM Products'); // Adjust your query as necessary
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
    }
});

module.exports = router;
