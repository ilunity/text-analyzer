FROM node:18-alpine
WORKDIR .
COPY . .

ARG SERVER_URL
ENV VITE_SERVER_URL $SERVER_URL

RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
