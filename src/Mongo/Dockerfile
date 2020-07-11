FROM mongo
#FROM ubuntu

#RUN apt-get update && apt-get install -y apt-utils wget gnupg gnupg2 curl
#RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
#RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
#RUN apt-get update
#RUN apt-get install -y mongodb-org
#RUN rm -rf /var/lib/apt/lists/

#VOLUME ["/data/db"]
#WORKDIR /data

#ENV PORT_=${PORT:-27017}

#EXPOSE $PORT_

#CMD mongod --bind_ip_all --port $PORT_
COPY docker-healthcheck /usr/local/bin/

HEALTHCHECK CMD ["docker-healthcheck"]