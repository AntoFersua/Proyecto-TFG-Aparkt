#!/bin/bash
set -e

PORT=${PORT:-8080}

sed -i "s/80/${PORT}/g" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/g" /etc/apache2/sites-available/000-default.conf

exec "$@"
