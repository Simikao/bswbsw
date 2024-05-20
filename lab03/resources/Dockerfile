# Use official Node.js image as a base
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "resource-server.js"]
