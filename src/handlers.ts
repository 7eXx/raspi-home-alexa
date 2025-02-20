import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest, Response } from 'ask-sdk-model';
import axios from 'axios';
import { create } from 'domain';
import { parse } from 'path';

const BACKEND_URL = 'http://localhost:5000/api';
const WELCOME_TEXT = 'Benvenuto in Tex Raspi Home. Cosa posso fare per te?';
const ERROR_TEXT = 'Mi dispiace, non ho capito. Riprova';

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

export const ControlDeviceIntentHandler: RequestHandler = {
    canHandle(handlerInput: HandlerInput): boolean {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ControlDeviceIntent';
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
    const result = await axios.put(BACKEND_URL + '/command', payload);
    
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
