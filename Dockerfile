# Use lightweight Node image
FROM nodesource/nsolid:latest

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Expose application port
EXPOSE 2999

# Run the web server
CMD ["npm","start"]
