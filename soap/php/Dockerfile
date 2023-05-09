FROM php:8.1.5-apache
RUN apt-get update && \
    apt-get install -y libxml2-dev
RUN docker-php-ext-install soap
COPY ./php.ini /usr/local/etc/php
WORKDIR /var/www/html
EXPOSE 80
