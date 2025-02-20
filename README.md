# Alexa TypeScript Node Project

A Node.js project for building Alexa Skills using TypeScript.

## Description

This project provides a foundation for developing Alexa Skills using TypeScript and Node.js. It includes the necessary setup and structure to create custom voice experiences for Amazon Alexa devices.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Amazon Developer Account

## Installation

```bash
npm install
```

## Development

```bash
npm run build     # Compile TypeScript
npm run start     # Start the application
npm run test      # Run tests
```

## Exposing
Expose local server to the internet using [ngrok](https://ngrok.com/).

```bash
ngrok http 3000
```

## Using in Alexa console
To alexa console use test tab to make some request:
```
open tex's raspi home | <skill invoke name>
```
This will open the alexa skill and than you can send some command:
```
turn on the device
```


## Project Structure

```
alexa-ts-node/
├── src/
│   └── index.ts
├── tests/
├── dist/
├── package.json
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.