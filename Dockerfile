# Build the React application
FROM node:18 as build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Serve the application with FastAPI
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
COPY --from=build /app/build /app/client/build
COPY server/ /app
COPY requirements.txt /app/
RUN pip install -r /app/requirements.txt