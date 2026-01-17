FROM node:18
WORKDIR /app
COPY ./MERN-Boilerplate/frontend /app
RUN npm install && npm run build
CMD ["npm", "start"]
