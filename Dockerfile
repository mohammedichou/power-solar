FROM node:latest
MAINTAINER Name Here <username@localhost>
COPY . /opt/power_solar
WORKDIR /opt/power_solar
RUN npm install
EXPOSE 80
CMD ["node", "server.js"]