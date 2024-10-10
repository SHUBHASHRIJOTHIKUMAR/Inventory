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

// Define the login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Connect to the database
    const pool = await sql.connect(dbConfig);

    // Call the stored procedure
    const result = await pool.request()
      .input('Username', sql.VarChar(50), username)
      .input('Password', sql.VarChar(255), password)
      .execute('UserLogin');

    // Check if the procedure returned data
    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset[0]); // Send back user data
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
