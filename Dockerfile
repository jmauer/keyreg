# Verwende ein offizielles Node.js-Image als Basis
FROM node:20.5.1

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere das Package.json und den Package-lock.json in das Arbeitsverzeichnis
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install -g npm@10.3.0
RUN npm install

# Kopiere den Rest der Anwendung in das Arbeitsverzeichnis
COPY . .

# Baue die Angular-Anwendung
RUN npm run build

# Port freigeben
EXPOSE 5002

# Starte die Anwendung
CMD ["npm", "start"]
