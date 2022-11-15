FROM node:14
RUN apt install git
RUN git clone https://github.com/gustavobarsan/easywash-backend.git
WORKDIR /easywash-backend
RUN npm install
EXPOSE 8000
CMD NODE_URLS=http://*:$PORT npm start