FROM openjdk:8-jdk AS build

ARG BACKEND_URL="http://localhost:3000/"
ENV BACKEND_URL=$BACKEND_URL
RUN echo $BACKEND_URL;

WORKDIR /usr/src/app

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
	&& apt-get install -y nodejs \
	&& rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
	&& apt-get update -qqy \
	&& apt-get -qqy install google-chrome-stable \
	&& rm /etc/apt/sources.list.d/google-chrome.list \
	&& rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
	&& sed -i 's/"$HERE\/chrome"/"$HERE\/chrome" --no-sandbox/g' /opt/google/chrome/google-chrome

COPY package*.json ./

RUN npm install

# Download the chrome binaries
RUN ./node_modules/.bin/webdriver-manager update --versions.chrome 85.0.4183.87

COPY . .

RUN echo $BACKEND_URL
RUN cat ./src/assets/env.js
RUN sed -i "s|http://localhost:3000|$BACKEND_URL|g" ./src/assets/env.js
RUN cat ./src/assets/env.js
RUN npm run-script build:prod
RUN npm run e2e

## STAGE 2

FROM nginx:1.17.1-alpine
#COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/anmeldesystem-ui /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
