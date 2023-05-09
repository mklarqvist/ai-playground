# Dockerfile
FROM node:19-alpine
WORKDIR /app
RUN apk add --update --no-cache libc6-compat 
COPY package*.json ./
RUN npm install
EXPOSE 3000

CMD ["npm", "run", "dev", "--"]
