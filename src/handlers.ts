import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { IntentRequest, Response } from 'ask-sdk-model';

const WELCOME_TEXT = 'Benvenuto in Tex Raspi Home. Cosa posso fare per te?';

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
    handle(handlerInput: HandlerInput): Response {
        const intentRequest = handlerInput.requestEnvelope.request as IntentRequest;
        const action = intentRequest.intent.slots?.action.value;
        let speechText = 'Comando non riconosciuto';

        // Add your Raspberry Pi automation logic here
        if (action === 'on' || action === 'apri') {
            speechText = 'Sto aprendo il cancello';
            console.log(speechText);
        } else if (action === 'off' || action === 'chiudi') {
            speechText = 'Sto chiudendo il cancello';
            console.log(speechText);
        }

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};