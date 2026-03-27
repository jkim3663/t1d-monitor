# Environments:
- local: one we will do development from our laptop
- staging: one we will deploy to Cloud

# Run Local:
npm run dev:local

# Run Stage:
1. npm run build:staging
2. serve -s dist -l 5173