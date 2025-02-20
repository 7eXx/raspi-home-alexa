
import path from 'path';
import * as dotenv from 'dotenv';
import express from 'express';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import { SkillBuilders } from 'ask-sdk-core';
import { LaunchRequestHandler, ControlDeviceIntentHandler } from './handlers';

dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const PORT = process.env.SERVICE_PORT || 3000;
const ALEXA_SKILL_ID = process.env.ALEXA_SKILL_ID;

if (!ALEXA_SKILL_ID) {
    throw new Error('Alexa skill ID is missing');
}

const app = express();

const skillBuilder = SkillBuilders.custom();
const skill = skillBuilder
    .withSkillId(ALEXA_SKILL_ID)
    .addRequestHandlers(
        LaunchRequestHandler,
        ControlDeviceIntentHandler
    ).create();

const adepter = new ExpressAdapter(skill, true, true);

app.post('/', adepter.getRequestHandlers());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});