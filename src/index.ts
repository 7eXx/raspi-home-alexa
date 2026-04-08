

import express from 'express';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import { SkillBuilders } from 'ask-sdk-core';
import { 
    LaunchRequestHandler, 
    GateControlIntentHandler,
    StatusControlIntentHandler, 
    HelpIntentHandler, 
    CancelIntentHandler, 
    SessionEndedRequestHandler, 
    ErrorHandler 
} from './handlers';
import environment from './environment';
import logger from './logger';
import healthCheckController from './controllers/health-check.controller';

const app = express();

const skillBuilder = SkillBuilders.custom();
const skill = skillBuilder
    .withSkillId(environment.ALEXA_SKILL_ID)
    .addRequestHandlers(
        GateControlIntentHandler,
        StatusControlIntentHandler,
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .create();

const adepter = new ExpressAdapter(skill, true, true);

app.post('/', adepter.getRequestHandlers());
app.get('/health-check', healthCheckController.healthCheck);

logger.info(`RASPI_HOME_BACKEND_URL: ${environment.RASPI_HOME_BACKEND_URL}`);

app.listen(environment.PORT, () => {
    logger.info(`Server is running on port ${environment.PORT}`);
});