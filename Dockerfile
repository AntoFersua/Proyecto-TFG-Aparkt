FROM php:8.2.0-apache

RUN docker-php-ext-install pdo_mysql
RUN a2enmod rewrite

RUN rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf; \
    ln -sf /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load; \
    ln -sf /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf

RUN sed -i 's/80/8080/g' /etc/apache2/ports.conf
RUN sed -i 's/:80/:8080/g' /etc/apache2/sites-available/000-default.conf

COPY . /var/www/html/

RUN { \
    echo "RewriteEngine On"; \
    echo "RewriteRule ^$ /app/views/aparkt/aparkt.html [L]"; \
} > /var/www/html/.htaccess

EXPOSE 8080

CMD ["apache2-foreground"]
