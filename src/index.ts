

import express from 'express';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import { SkillBuilders } from 'ask-sdk-core';
import { LaunchRequestHandler, GateControlIntentHandler, HelpIntentHandler, CancelIntentHandler, SessionEndedRequestHandler, ErrorHandler } from './handlers';
import environment from './environment';
import logger from './logger';

const app = express();

const skillBuilder = SkillBuilders.custom();
const skill = skillBuilder
    .withSkillId(environment.ALEXA_SKILL_ID)
    .addRequestHandlers(
        GateControlIntentHandler,
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .create();

const adepter = new ExpressAdapter(skill, true, true);

app.post('/', adepter.getRequestHandlers());

logger.debug(`RASPI_HOME_BACKEND_URL: ${environment.RASPI_HOME_BACKEND_URL}`);

app.listen(environment.PORT, () => {
    logger.info(`Server is running on port ${environment.PORT}`);
});