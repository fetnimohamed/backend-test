# Common build stage
FROM node:14.18-alpine3.14 as common-build-stage

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8800

# # Development build stage
# FROM common-build-stage as development-build-stage

# ENV NODE_ENV development

# CMD ["npm", "run", "dev"]

# # Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV vps

CMD ["npm", "run", "vps"]
