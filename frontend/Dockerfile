FROM node:18-alpine
COPY . /app

WORKDIR /app

RUN cd /app; 
RUN npm install; 
 
# Environment variables must be redefined at run time
ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

RUN npm run build;

EXPOSE 3000

CMD ["npm", "start"]