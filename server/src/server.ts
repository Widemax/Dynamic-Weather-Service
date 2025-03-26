import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config();

// Compute __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the routes
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the client/dist folder
app.use(express.static(path.join(__dirname, '../client/dist')));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect the routes
app.use(routes);

// Start the server on the specified port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
