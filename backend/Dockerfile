# Use Node v17 as the base image.
FROM node:17-alpine

# Set working directory in the container.
WORKDIR /app

# Copy everything from the current directory to /app in the container.
COPY . .

# Install dependencies
RUN npm install

# Set default value for CONFIG_ENV
ARG CONFIG_ENV=default
ENV CONFIG_ENV=${CONFIG_ENV}

# Expose our server port.
EXPOSE 5000

# Run our app.
CMD ["node", "/app/server.js"]
