FROM nginx:alpine
MAINTAINER Javashop

RUN mkdir -p /app/
COPY ./manager-seller/dist /app/
COPY ./manager-seller/nginx.conf /etc/nginx/nginx.conf
COPY ./manager-seller/set-envs.sh /app/set-envs.sh

RUN ["chmod", "+x", "/app/set-envs.sh"]

EXPOSE 443 80

CMD sh -c "/app/set-envs.sh && exec nginx -g 'daemon off;'"
