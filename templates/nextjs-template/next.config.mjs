import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Mongo API Keys
    MONGO_APIKEY_PRODUCTION: process.env.MONGO_APIKEY_PRODUCTION,
    MONGO_APIKEY_STAGING: process.env.MONGO_APIKEY_STAGING,
    MONGO_APIKEY_TEST: process.env.MONGO_APIKEY_TEST,
    MONGO_APIKEY_DEVELOPMENT: process.env.MONGO_APIKEY_DEVELOPMENT,

    // Base URLs
    MONGO_BASEURL_PRODUCTION: process.env.MONGO_BASEURL_PRODUCTION,
    MONGO_BASEURL_STAGING: process.env.MONGO_BASEURL_STAGING,
    MONGO_BASEURL_TEST: process.env.MONGO_BASEURL_TEST,
    MONGO_BASEURL_DEVELOPMENT: process.env.MONGO_BASEURL_DEVELOPMENT,


    
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
