FROM node:alpine

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk*

RUN apk add --no-cache tini

RUN npm install -g npm@9.1.1

EXPOSE 3000

COPY . ./

RUN npm install

ENTRYPOINT [ "/sbin/tini","--" ]

RUN ls
