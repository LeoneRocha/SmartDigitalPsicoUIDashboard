 ### STAGE 1: Build ###  esponsável por gerar o build da nossa aplicação  
FROM node:18 as node
# Create a directory for the app
WORKDIR /app
# Copy the rest of the app files to the app directory
COPY . .
# Install the app dependencies
RUN npm install  --force -g @angular/cli
# Build the app for production
RUN npm run build 
##--prod

### ESTÁGIO 2: Executar ###   2 - Responsável por expor nossa aplicação smartdigitalpsico *  based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest 
## Skip this if you are using kubernetes config map 
COPY nginx.conf /etc/nginx/nginx.conf
## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=node /app/dist/smartdigitalpsico /usr/share/nginx/html
  
EXPOSE 80  
EXPOSE 4209  
## Serve
CMD ["nginx", "-g", "daemon off;"]