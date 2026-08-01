### STAGE 1: Build ###
FROM node:22 AS node

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm install -g @angular/cli@22

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN npm run build -- --configuration=$NODE_ENV

### STAGE 2: Serve with Nginx ###
FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/smartdigitalpsico /usr/share/nginx/html

EXPOSE 80
EXPOSE 4209
CMD ["nginx", "-g", "daemon off;"]
