FROM node:16

# Set environment variable
ENV PORT 2567

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci
# Uncomment this for production:
# RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 2567

# Start the application
CMD [ "npm", "start" ]
