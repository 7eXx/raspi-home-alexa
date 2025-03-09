import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const PORT = process.env.SERVICE_PORT || 3000;
const ALEXA_SKILL_ID = process.env.ALEXA_SKILL_ID;
const RASPI_HOME_BACKEND_URL = process.env.RASPI_HOME_BACKEND_URL;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

if (!ALEXA_SKILL_ID) {
    throw new Error('Alexa skill ID is missing');
}

if (!RASPI_HOME_BACKEND_URL) {
    throw new Error('RASPI_HOME_BACKEND_URL environment variable is missing');
}

export default {
    PORT,
    ALEXA_SKILL_ID,
    RASPI_HOME_BACKEND_URL,
    LOG_LEVEL
};