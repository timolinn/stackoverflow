FROM node:12
# Create app directory
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app
# Install app dependencies
COPY package*.json ./
USER node
RUN npm install
# Copy app source code
COPY --chown=node:node . .
RUN npm run build
#Expose port and start application
EXPOSE 8000
CMD [ "npm", "start" ]