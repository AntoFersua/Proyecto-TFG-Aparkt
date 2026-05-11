FROM php:8.2-apache

RUN docker-php-ext-install pdo_mysql
RUN a2enmod rewrite

COPY . /var/www/html/

RUN { \
    echo "RewriteEngine On"; \
    echo "RewriteRule ^$ /app/views/aparkt/aparkt.html [L]"; \
} > /var/www/html/.htaccess

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
