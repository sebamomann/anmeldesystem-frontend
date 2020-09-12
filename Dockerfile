
FROM node:12-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

# Install Chromium
RUN apk add --update --no-cache\
    chromium-chromedriver\
    chromium


COPY . .

RUN npm run e2e
RUN npm run-script build:prod

## STAGE 2

FROM nginx:1.17.1-alpine
#COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/anmeldesystem-ui /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
