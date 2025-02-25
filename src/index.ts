

import express from 'express';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import { SkillBuilders } from 'ask-sdk-core';
import { LaunchRequestHandler, GateControlIntentHandler, HelpIntentHandler, CancelIntentHandler, SessionEndedRequestHandler, ErrorHandler } from './handlers';
import environment from './environment';

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

app.listen(environment.PORT, () => {
    console.log(`Server running on port ${environment.PORT}`);
});