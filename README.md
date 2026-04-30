# t1d-monitor
Type 1 Diabetes Monitoring Dashboard

1. [Tech Stack](#tech-stack)
2. [Mock dataset](#mock-dataset)
3. [Running Application from GCP](#running-application-from-gcp)
4. [Running App Locally](#running-entire-application-locally)


# Tech Stack
- Frontend -> Backend Reverse Proxy -> Backend FHIR Server
- Frontend leverages React + TypeScript using Vite.
- Backend Reverse Proxy leverages GO with libraries to support JWT auth, web flow.
- Backend FHIR server and database leverage [HAPI FHIR Starter](https://github.com/hapifhir/hapi-fhir-jpaserver-starter) with custom security implementation
- Application is Dockerized and deployed to Google Cloud Platform Compute Engine (Virtual Machine)

# Mock Dataset
Refer to this repositories mock-data/ folder.

# Running Application From GCP
1. ```docker compose --env-file .env.dev down -v```
2. ```docker compose --env-file .env.dev build --no-cache```
3. ```docker compose --env-file .env.dev up```
Or just run everything in one command:
```docker compose --env-file .env.dev down -v && docker compose --env-file .env.dev build --no-cache && docker compose --env-file .env.dev up```

# Running Entire Application Locally
Docker compose has been configured to spin up all db, backend, and frontend.
Run ```docker compose --env-file .env.local up``` from t1d-monitor/fhir/ directory.
If there is change in frontend, then image should be re-built. Run below commands in-order:
1. ```docker compose --env-file .env.local down -v```
2. ```docker compose --env-file .env.local build --no-cache```
3. ```docker compose --env-file .env.local up```
Or just run everything in one command:
```docker compose --env-file .env.local down -v && docker compose --env-file .env.local build --no-cache && docker compose --env-file .env.local up```
