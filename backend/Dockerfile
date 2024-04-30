# Use Node v4 as the base image.
FROM node:17-alpine


COPY . /app

WORKDIR /app

# Install dependencies
RUN cd /app; 
RUN npm install;

ARG CONFIG_ENV
ENV CONFIG_ENV=${CONFIG_ENV}

# Expose our server port.
EXPOSE 5000

# Run our app.
CMD ["node", "/app/server.js"]