FROM node:20.3.0-alpine
RUN npm install -g nodemon 
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm","start"]
