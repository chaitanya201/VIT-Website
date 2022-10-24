FROM node:16
WORKDIR /frontend
COPY package.json ./package.json
COPY ./public ./public
COPY ./src ./src
COPY ./tailwind.config.js ./tailwind.config.js
RUN npm install
EXPOSE 3000
CMD [ "npm","start" ]