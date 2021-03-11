# FROM node:14

# # Create app directory
# WORKDIR /app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# ENV PATH /app/node_modules/.bin:$PATH

# COPY package*.json ./

# # RUN npm install
# # If you are building your code for production
# RUN npm ci --only=production

# # Bundle app source
# COPY . /app

# EXPOSE 80
# CMD [ "node", "server.js" ]
FROM node:14.16.0-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
RUN npm install
EXPOSE 80
ARG TUNEBLADE_HOST
CMD [ "REACT_APP_TUNEBLADE_ENDPOINT=${TUNEBLADE_HOST}", "node", "server.js" ]