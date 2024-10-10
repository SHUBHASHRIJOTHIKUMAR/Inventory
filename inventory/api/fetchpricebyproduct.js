const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Database configuration
const dbConfig = {
    server: 'PSGST-SHUBHA', // Your SQL Server instance name
    database: 'Inventory', // The name of the database you're connecting to
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

// Route to get product price from the GetProductPrice stored procedure
router.get('/product-price/:id', async (req, res) => {
    const productId = parseInt(req.params.id); // Get the product ID from the route parameter

    try {
        // Connect to the database
        const pool = await sql.connect(dbConfig);

        // Prepare the SQL request
        const request = pool.request();

        // Add input parameter to the request
        request.input('p_product_id', sql.Int, productId);
        request.output('p_price', sql.Int); // Define the output parameter

        // Execute the GetProductPrice stored procedure
        await request.execute('GetProductPrice');

        // Retrieve the output parameter value
        const productPrice = request.parameters.p_price.value; // Get the value of the output parameter

        // Check if the price was returned
        if (productPrice !== null) {
            res.status(200).json({ price: productPrice }); // Send the product price as JSON
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error executing stored procedure:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the database connection
        await sql.close();
    }
});

module.exports = router;
