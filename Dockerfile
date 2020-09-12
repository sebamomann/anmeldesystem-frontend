
FROM node:12-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install protractor -g
RUN webdriver-manager update --versions.chrome=85.0.4183.87

COPY . .

RUN npm run e2e
RUN npm run-script build:prod

## STAGE 2

FROM nginx:1.17.1-alpine
#COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/anmeldesystem-ui /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
