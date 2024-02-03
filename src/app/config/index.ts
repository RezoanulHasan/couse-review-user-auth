import dotenv from 'dotenv';
import path from 'path';

//dotenv.config({ path: path.join(process.cwd(), '.env') });
const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });
export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
