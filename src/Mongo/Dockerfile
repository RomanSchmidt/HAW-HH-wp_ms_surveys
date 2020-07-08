FROM ubuntu

RUN apt-get update && apt-get install -y apt-utils wget gnupg gnupg2 curl
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
RUN apt-get update
RUN apt-get install -y mongodb-org
RUN rm -rf /var/lib/apt/lists/

VOLUME ["/data/db"]
WORKDIR /data


#CMD touch /var/log/mongod.log
#CMD chown mongodb:mongodb /var/log/mongod.log

#CMD mongod --logpath /var/log/mongodb/mongod.log --dbpath /data/db/

EXPOSE 27017
EXPOSE 27018
EXPOSE 27019

CMD ["mongod", "--bind_ip_all"]