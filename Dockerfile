FROM nginx:alpine
MAINTAINER Shopfly.cloud

RUN mkdir -p /app/
COPY ./dist /app/
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./set-envs.sh /app/set-envs.sh

RUN ["chmod", "+x", "/app/set-envs.sh"]

EXPOSE 443 80

CMD sh -c "/app/set-envs.sh && exec nginx -g 'daemon off;'"
