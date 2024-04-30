# Use Node v18 as the base image.
FROM node:18-alpine

# Set working directory in the container.
WORKDIR /app

# Copy everything from the current directory to /app in the container.
COPY . .

# Install dependencies and build
RUN npm install

# Set default values for environment variables
ARG ENV_VARIABLE=default
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE=default
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

RUN npm run build

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
