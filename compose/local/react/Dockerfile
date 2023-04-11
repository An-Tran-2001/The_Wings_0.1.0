# Use the official Node.js image as the base image
FROM node:19-alpine as react-build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./the-wings-frontend/

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

CMD ["npm", "start"]
EXPOSE 3000