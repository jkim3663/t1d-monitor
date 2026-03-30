# t1d-monitor
Type 1 Diabetes Monitoring Dashboard

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
Run ```docker-compose --env-file .env.local up``` from fhir/ folder