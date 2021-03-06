FROM node:slim
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 5000
CMD ["yarn", "dev"]