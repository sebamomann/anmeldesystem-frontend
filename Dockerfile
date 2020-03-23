
FROM node:12.7-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npx npm-force-resolutions
RUN npm install

COPY . .

RUN npm run build:prod

## STAGE 2

FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/anmeldesystem-frontend /usr/share/nginx/html