 ### STAGE 1: Build ###  esponsável por gerar o build da nossa aplicação  
FROM node:18 as node
 
# Create a directory for the app
WORKDIR /app
# Copy the rest of the app files to the app directory
COPY . .
# Install the app dependencies
RUN npm install --force -g @angular/cli
RUN npm install --force 
RUN npm install --force  @angular-builders/custom-webpack 

#environment
# Define o valor padrão para NODE_ENV
ARG NODE_ENV=development

# Usa o valor do argumento ou o valor padrão se não for especificado
ENV NODE_ENV=$NODE_ENV
#docker build --build-arg NODE_ENV=homologation -t minha-imagem .  

# Build the app for production
RUN npm run build -- --configuration=$NODE_ENV

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