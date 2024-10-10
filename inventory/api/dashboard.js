const express = require('express');
const sql = require('mssql');
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

// Define the route to get stock count
router.get('/stocks/count', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('CountStocks'); // Call the stored procedure
        
        // Assuming the stored procedure returns the count in the first row
        const stockCount = result.recordset[0].StockCount;

        res.status(200).json({ stockCount });
    } catch (error) {
        console.error('Error fetching stock count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
