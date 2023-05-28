FROM postgres:15

COPY ./yapi/*sql /docker-entrypoint-initdb.d/

