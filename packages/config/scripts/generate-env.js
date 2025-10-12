import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ES Module uyumlu __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını ana dizinden al
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const envOutput = `export const env = {
  LIVE: {
    DB_HOST: "${process.env.DB_HOST_LIVE}",
    DB_PORT: ${process.env.DB_PORT_LIVE},
    DB_NAME: "${process.env.DB_NAME_LIVE}",
    DB_USER: "${process.env.DB_USER_LIVE}",
    DB_PASS: "${process.env.DB_PASS_LIVE}",
    MONGO: {
      apiKey: "${process.env.MONGO_APIKEY_PRODUCTION}",
      baseUrl: "${process.env.MONGO_BASEURL_PRODUCTION}"
    }
  },
  STAGING: {
    DB_HOST: "${process.env.DB_HOST_STAGING}",
    DB_PORT: ${process.env.DB_PORT_STAGING},
    DB_NAME: "${process.env.DB_NAME_STAGING}",
    DB_USER: "${process.env.DB_USER_STAGING}",
    DB_PASS: "${process.env.DB_PASS_STAGING}",
    MONGO: {
      apiKey: "${process.env.MONGO_APIKEY_STAGING}",
      baseUrl: "${process.env.MONGO_BASEURL_STAGING || ""}"
    }
  },
  TEST: {
    DB_HOST: "${process.env.DB_HOST_TEST}",
    DB_PORT: ${process.env.DB_PORT_TEST},
    DB_NAME: "${process.env.DB_NAME_TEST}",
    DB_USER: "${process.env.DB_USER_TEST}",
    DB_PASS: "${process.env.DB_PASS_TEST}",
    MONGO: {
      apiKey: "${process.env.MONGO_APIKEY_TEST}",
      baseUrl: "${process.env.MONGO_BASEURL_TEST}"
    }
  },
  DEVELOPMENT: {
    DB_HOST: "${process.env.DB_HOST_DEVELOPMENT}",
    DB_PORT: ${process.env.DB_PORT_DEVELOPMENT},
    DB_NAME: "${process.env.DB_NAME_DEVELOPMENT}",
    DB_USER: "${process.env.DB_USER_DEVELOPMENT}",
    DB_PASS: "${process.env.DB_PASS_DEVELOPMENT}",
    MONGO: {
      apiKey: "${process.env.MONGO_APIKEY_DEVELOPMENT}",
      baseUrl: "${process.env.MONGO_BASEURL_DEVELOPMENT}"
    }
  }
};
`;

const outPath = path.resolve(__dirname, "../dist/env.js");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, envOutput);

console.log("✅ Env values embedded to dist/env.js");
