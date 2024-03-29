FROM node:latest

WORKDIR /usr/app

COPY package.json ./

RUN npm install --force

COPY . ./

EXPOSE 8000

CMD ["npm", "run", "dev"]