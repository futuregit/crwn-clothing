FROM node:slim
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn add node-sass
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]