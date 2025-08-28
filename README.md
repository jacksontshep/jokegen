# JokeGen

A tiny Node.js + LangChain web app that streams a joke and its punch-line for any topic you provide.

## Features
* Generates jokes with separate `joke` and `punchline` fields using a structured LLM call.
* Web UI served via Express with WebSocket communication.
* Docker-ready (see `Dockerfile` & `docker-compose.yml`).

## Prerequisites
1. **OpenAI API key** – export `OPENAI_API_KEY` in your shell or add it to the Compose file.
2. Node.js 20+ **or** Docker Desktop.

## Local development
```bash
# install deps
npm install

# set your key
set OPENAI_API_KEY=sk-...

# start the server
npm start

# open the UI
http://localhost:2999
```

## Docker
```bash
# build & run
docker compose up --build

# UI will be available at
http://localhost:2999
```

## Project structure
```
├─ public/           # browser UI
├─ index.js          # main backend & LangChain chain
├─ Dockerfile        # production image
├─ docker-compose.yml
└─ package.json
```

Enjoy the jokes!
