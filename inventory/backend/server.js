const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginApi = require('../api/loginapi'); // Correct relative path to loginapi.js
const fetchstock = require('../api/fetchstock'); // New stock API
const addnewproduct = require('../api/addnewproduct'); // New stock API
const fetchorder = require('../api/fetchorder'); // New stock API
const fetchpricebyproduct = require('../api/fetchpricebyproduct'); // New stock API
const addplaceorder = require('../api/addplaceorder'); // addnewproduct New product API
const dashboard = require('../api/dashboard'); // adashboard API

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse incoming request bodies

// Use the login API
app.use('/api', loginApi); // This will route /api/login to loginApi
app.use('/api', fetchstock);  // Stock API
app.use('/api', addnewproduct);  // addstock API
app.use('/api', fetchorder);  // fetchorder API
app.use('/api', fetchpricebyproduct);  // fetchpricebyproduct API
app.use('/api', addplaceorder);  // addnewproduct New product API
app.use('/api', dashboard);  // adashboard API


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
