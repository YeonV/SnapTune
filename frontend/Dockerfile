# # stage1 - build react app first 
# FROM node:12.16.1-alpine3.9 as build
# WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY ./package.json /app/
# COPY ./yarn.lock /app/
# RUN yarn --silent
# COPY . /app
# RUN yarn build

# # stage 2 - build the final image and copy the react build files
# FROM nginx:1.17.8-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# dockerfile
# stage 1
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
RUN npm ci --loglevel verbose
ARG SNAPCAST_HOST
RUN REACT_APP_SNAPCAST_ENDPOINT=${SNAPCAST_HOST} npm run build
# # stage 2
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]