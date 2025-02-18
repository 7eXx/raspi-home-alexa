
import express from 'express';
import bodyParser from 'body-parser';
import { SkillBuilders } from 'ask-sdk-core';
import { LaunchRequestHandler, ControlDeviceIntentHandler } from './handlers';

const app = express();
app.use(bodyParser.json());

const skillBuilder = SkillBuilders.custom();

const skill = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        ControlDeviceIntentHandler
    )
    .create();

app.post('/', async (req, res) => {
    try {
        const response = await skill.invoke(req.body);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});