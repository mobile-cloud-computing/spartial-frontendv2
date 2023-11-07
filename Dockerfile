FROM node:16.17.0-bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript React app
RUN npm run build

# Expose the port that your React app will run on (default is 3000)
EXPOSE 3000

# Specify the command to start your React app
CMD ["npm", "start"]

