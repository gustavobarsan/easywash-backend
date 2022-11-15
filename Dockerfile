FROM node:14
WORKDIR /app
COPY . .
RUN npm install -g npm@9.1.1
RUN npm install
EXPOSE 8000
CMD NODE_URLS=http://*:$PORT npm start