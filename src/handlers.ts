import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest, Response } from 'ask-sdk-model';
import axios from 'axios';
import environment from './environment'
import logger from './logger';

const WELCOME_TEXT = 'Benvenuto in Tex Raspi Home. Cosa posso fare per te?';
const ERROR_TEXT = 'Mi dispiace, non ho capito. Riprova';
const GOODBYE_TEXT = 'A presto!';

export const LaunchRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = WELCOME_TEXT;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

export const HelpIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        const speechText = WELCOME_TEXT;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

export const StopIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        return handlerInput.responseBuilder
            .speak(GOODBYE_TEXT)
            .getResponse();
    }
};

export const CancelIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent';
    },
    handle(handlerInput: HandlerInput): Response {
        return handlerInput.responseBuilder
            .speak(GOODBYE_TEXT)
            .getResponse();
    }
};

export const SessionEndedRequestHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput: HandlerInput): Response {
        return handlerInput.responseBuilder.getResponse();
    }
};

export const ErrorHandler: RequestHandler = {
    canHandle(): boolean {
        return true;
    },
    handle(handlerInput: HandlerInput): Response {
        logger.error(`Error handled: ${handlerInput.requestEnvelope.request.type}`);
        return handlerInput.responseBuilder
            .speak(ERROR_TEXT)
            .getResponse();
    }
};

export const GateControlIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GateControlIntent';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
        const action = intentRequest.intent.slots?.action.value;

        // Add your Raspberry Pi automation logic here
        if (action === 'apri' || action === 'chiudi') {
            // call the Raspberry Pi API
            const isOpen = await performGateRequest(action);
            const speechText = createGateResponseTextFromState(isOpen);
            logger.debug(speechText);

            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        }
        
        return handlerInput.responseBuilder
                .speak(ERROR_TEXT)
                .getResponse();
    }
};

export const StatusControlIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'StatusControlIntent';
    },
    async handle(handlerInput: HandlerInput): Promise<Response> {
        const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
        const object = intentRequest.intent.slots?.object.value;

        if (object === 'cancello') {
            // call the Raspberry Pi API
            const isOpen = await getGateState();
            const speechText = createGateResponseTextFromState(isOpen);

            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        }

        if (object === 'casa') {
            // call the Raspberry Pi API
            const isActive = await getAlarmEcuState();
            const speechText = createAlarmResponseTextFromState(isActive);

            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        }

        return handlerInput.responseBuilder
                .speak(ERROR_TEXT)
                .getResponse();
    }
};

async function getAlarmEcuState(): Promise<any> {
    const payload = { command: "is_alarm_ecu_active" };
    const result = await callCommandApi(payload);

    return parseState(result.data);
}

async function getGateState(): Promise<any> {
    const payload = { command: "is_gate_open" };
    const result = await callCommandApi(payload);

    return parseState(result.data);
}

async function performGateRequest(action: string): Promise<any> {
    const payload = createGatePayload(action);
    const result = await callCommandApi(payload);
    
    return parseState(result.data);
}

async function callCommandApi(payload: any): Promise<any> {
    return axios.put(environment.RASPI_HOME_BACKEND_URL + '/command', payload);
}

function createGatePayload(action: string): any {
    const status = action === 'apri' ? 1 : 0;
    return {
        command: "gate_ecu_set",
        state: status
    }
}

function parseState(data: any): boolean {
    return !!data['s'];
}

function createGateResponseTextFromState(state: boolean): string {
    return state ? 'Il cancello è aperto' : 'Il cancello è chiuso';
}

function createAlarmResponseTextFromState(state: boolean): string {
    return state ? 'ECU allarme attivo' : 'ECU allarme non attivo';
}
