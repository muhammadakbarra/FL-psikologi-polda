const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); // Add this import
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'storage' directory
// Add this line to serve the storage folder
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
