# Stage 1

FROM node:12.20.1-alpine3.10 as build-step

WORKDIR /app/

COPY package.json /app/

RUN cd /app && npm set progress=false && npm install

COPY . /app/

RUN cd /app && npm run build --prod

# stage 2

FROM nginx:1.19.4-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-step /app/dist/app-pm-tool/ /usr/share/nginx/html

COPY /webapp.conf  /etc/nginx/conf.d/webapp.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]