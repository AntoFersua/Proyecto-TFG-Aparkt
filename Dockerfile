FROM php:8.2-cli

RUN docker-php-ext-install pdo_mysql

COPY . /var/www/html/

WORKDIR /var/www/html

EXPOSE ${PORT:-8080}

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} server.php"]
