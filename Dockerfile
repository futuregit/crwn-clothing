FROM node:slim
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn remove node-sass
RUN yarn add node-sass@4.14.1
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]