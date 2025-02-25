import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest, Response } from 'ask-sdk-model';
import axios from 'axios';
import environment from './environment'

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
        console.log(`Error handled: ${handlerInput.requestEnvelope.request.type}`);
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
            const speechText = createResponseTextFromStatus(isOpen);
            console.log(speechText);

            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        }
        
        return handlerInput.responseBuilder
                .speak(ERROR_TEXT)
                .getResponse();
    }
};

async function performGateRequest(action: string): Promise<any> {
    const payload = createGatePayload(action);
    const result = await axios.put(environment.RASPI_HOME_BACKEND_URL + '/command', payload);
    
    return parseGateStatus(result.data);
}

function createGatePayload(action: string): any {
    const status = action === 'apri' ? 1 : 0;
    return {
        command: "gate_ecu_set",
        state: status
    }
}

function parseGateStatus(data: any): boolean {
    return !!data['s'];
}

function createResponseTextFromStatus(status: boolean): string {
    return status ? 'Il cancello è aperto' : 'Il cancello è chiuso';
}
