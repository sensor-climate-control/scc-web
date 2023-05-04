FROM node:18
WORKDIR /usr/app
COPY . .
RUN npm run build
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
