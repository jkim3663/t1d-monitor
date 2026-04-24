# t1d-monitor
Type 1 Diabetes Monitoring Dashboard

1. [Tech Stack](#tech-stack)
2. [Running App Locally](#running-entire-application-locally)
3. [Frontend](#frontend)
    1. [Environments](#environments)
    2. [Run Local](#run-local)
    3. [Run Stage](#run-stage)
    4. [Running Docker Image](#run-docker-image)
        1. [Prerequisites](#prerequisites)
        2. [Instructions](#instructions)
4. [Backend](#backend)
    1. [Information](#information)
    2. [Environments](#environments-1)
    3. [Run Local](#run-local-1)



# Tech Stack
- Frontend leverages React + TypeScript using Vite.
- Backend and database leverage [HAPI FHIR Starter](https://github.com/hapifhir/hapi-fhir-jpaserver-starter) with custom security implementation 

# Running Entire Application Locally
Docker compose has been configured to spin up all db, backend, and frontend.
Run ```docker compose --env-file .env.local up``` from t1d-monitor/fhir/ directory.
If there is change in frontend, then image should be re-built. Run below commands in-order:
1. ```docker compose --env-file .env.local down -v``
2. ```docker compose --env-file .env.local build --no-cache```
3. ```docker compose --env-file .env.local up```
Or just run everything in one command:
```docker compose --env-file .env.local down -v && docker compose --env-file .env.local build --no-cache && docker compose --env-file .env.local up```

# Frontend
## Environments
- local: one we will do development from our laptop
- staging: one we will deploy to Cloud

## Run Local
```npm run dev:local```

## Run Stage
1. ```npm run build:staging```
2. ```serve -s dist -l 5173```

## Run Docker image
### Prerequisites
- have docker installed
- run docker deskop
### Instructions
1. bulid image by running ```docker build . -t "frontend:v1.0"```
2. run docker image by running ```docker run -p 5173:5173 frontend:v1.0```

# Backend
## Information
Using github starter pack http://localhost:8080/fhir/Patient

## Environments
- local: ```.env.local``` and ```hapi.application-local.yaml```
- dev: ```.env.dev``` and ```hapi.application-dev.yaml```

## Run Local
Run ```docker compose --env-file .env.local up``` from fhir/ folder
