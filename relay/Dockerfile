# DuoDesk cloud relay: docker build -t duodesk-relay relay && docker run -p 8080:8080 duodesk-relay
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js ./
ENV PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server.js"]
