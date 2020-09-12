
FROM node:12 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npx npm-force-resolutions
RUN npm install
RUN apt-get update && \
    DEBIAN_FRONTEND="nointeractive" \
    apt-get install -y --no-install-recommends \
    chromium=73.0.3683.75-1~deb9u1 \
    libgconf-2-4 \
    openjdk-8-jre-headless \
    && rm -rf /var/lib/apt/lists/*
RUN npm run pree2e
RUN npm run e2e

COPY . .

RUN npm run-script build:prod

## STAGE 2

FROM nginx:1.17.1-alpine
#COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/anmeldesystem-ui /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
