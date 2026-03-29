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
## Environments
- local: build using maven and use IDE or run ```java -jar target/app-name.jar```
- staging: use Dockerfile

## Run Local
Either use your IDE or run ```java -jar be/target/app-name.jar```

## Run Docker image
### Instructions
1. run ```mvn clean package```
2. ```docker build . -t "backend"```
3. run docker image by cmd ```docker run -p 8443:8443 backend```
