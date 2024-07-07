import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    // Add other environment variables here if needed
  },
};

export default nextConfig;
