# Étape 1 : Build du frontend avec Vite
FROM node:18 AS build-frontend
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Étape 2 : Build du backend avec Express
FROM node:18
WORKDIR /app

# Copie backend uniquement
COPY backend/package*.json ./
RUN npm install
COPY backend .

# Copie le frontend buildé dans le backend
COPY --from=build-frontend /app/frontend/dist ./dist

# Servir les fichiers statiques du frontend avec Express
EXPOSE 5000
CMD ["node", "server.js"]
