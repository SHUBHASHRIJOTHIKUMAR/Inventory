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


// Route to get order data from the GetOrders stored procedure
router.get('/orders', async (req, res) => {
    try {
        // Connect to the database
        const pool = await sql.connect(dbConfig);

        // Execute the GetOrders stored procedure
        const result = await pool.request().execute('GetOrders');

        // Check if there is data returned
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset); // Send the order data as JSON
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error executing stored procedure:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;


