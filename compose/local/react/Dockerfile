# Use the official Node.js image as the base image
FROM node:19-alpine as react-build-stage

# Set working directory
WORKDIR /app-frontend

# Copy package.json and package-lock.json to work directory
COPY ./the-wings-frontend/package.json ./the-wings-frontend/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./the-wings-frontend/ .

CMD ["npm", "start"]
EXPOSE 3000