
import express from 'express';
import bodyParser from 'body-parser';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import { SkillBuilders } from 'ask-sdk-core';
import { LaunchRequestHandler, ControlDeviceIntentHandler } from './handlers';

const PORT = 3000;

const app = express();

const skillBuilder = SkillBuilders.custom();
const skill = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        ControlDeviceIntentHandler
    ).create();

const adepter = new ExpressAdapter(skill, true, true);

app.post('/', adepter.getRequestHandlers());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});