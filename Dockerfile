FROM hub-dev.hexin.cn/b2cweb/node:v8.9
COPY ./ /var/www/ths-vscode-plugin
COPY ./readiness.sh /opt/readiness.sh
COPY ./.builddep/prod/nginx/ /usr/local/openresty/nginx/conf/

ENV ENABLE_MONGODB true
ENV ENABLE_REDIS=true \
    ENABLE_MEMCACHED=true \
    ENABLE_PHPLIBRARY=true \
    ENABLE_PHPLIGTH=false \
    ENABLE_PHPZEND=true \
	ENABLE_VENDOR=true \
	ENABLE_INFRASTRUCTURE=true \
    CODEPATH='/var/www/ths-vscode-plugin'
EXPOSE 80
