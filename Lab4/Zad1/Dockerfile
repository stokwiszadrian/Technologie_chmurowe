
FROM node:14
WORKDIR /usr/src/my_node_app
COPY ./ ./
RUN npm install
EXPOSE 8080
CMD ["node", "server.js"]