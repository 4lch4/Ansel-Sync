FROM node:16

WORKDIR /batch

COPY . .

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
