# Deployment Guide for Spartial Frontend v2

This document provides a step-by-step guide to deploying the Spartial Frontend v2 application. The guide covers both deployment to GitHub Pages and running the application using a Docker container.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or later)
- **npm** (v8.x or later)
- **Git**
- **Docker** (for containerized deployment)
- **A GitHub repository** for deployment

## Deployment Options

### Option 1: Deploy to GitHub Pages

#### Steps to Deploy

1. **Clone the Repository**

   Clone the repository to your local machine:

   ```bash
   git clone https://github.com/mobile-cloud-computing/spartial-frontendv2.git
   cd spartial-frontendv2
   ```

2. **Install Dependencies**

   Install the project dependencies using npm:

   ```bash
   npm install
   ```

3. **Build the Project**

   Build the project for production. This step generates static files in the `build` directory, ready for deployment:

   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages**

   The project is configured to deploy to GitHub Pages. To deploy, use the following command:

   ```bash
   npm run deploy
   ```

   This command will:

    - Run the `predeploy` script, which builds the project.
    - Deploy the contents of the `build` directory to the `gh-pages` branch of your GitHub repository.

5. **Access the Deployed Application**

   Once the deployment is complete, your application will be available at the following URL:

   ```plaintext
   https://mobile-cloud-computing.github.io/spartial-frontendv2/
   ```

### Option 2: Running the Application in a Docker Container

#### Steps to Build and Run the Docker Container

1. **Create a Dockerfile**

   Ensure the following `Dockerfile` is present in the root directory of your project:

   ```dockerfile
   FROM node:18

   WORKDIR /app

   COPY package*.json ./

   RUN npm install

   COPY . .

   EXPOSE 3000

   ENV HOST=0.0.0.0
   ENV PORT=3000
   ENV REACT_APP_ENV=development

   # Command to run the app
   CMD ["npm", "start"]
   ```

2. **Build the Docker Image**

   Run the following command in the project directory to build the Docker image:

   ```bash
   docker build -t spatial-frontendv2 .
   ```

3. **Run the Docker Container**

   After the image is built, start the container using:

   ```bash
   docker run -p 3000:3000 spatial-frontendv2
   ```

   The application will be accessible at `http://localhost:3000`.

4. **Customizing Environment Variables (Optional)**

   You can adjust the environment variables in the Dockerfile to suit different environments (development, production, etc.).

### Troubleshooting

If you encounter issues during deployment, consider the following:

- Ensure that your GitHub Pages settings are correctly configured to serve from the `gh-pages` branch.
- Verify that all dependencies are installed without errors.
- Check the console output during deployment or container build for any error messages.

### Notes

- The `proxy` field in `package.json` is used for development purposes and does not affect the production deployment.
- The application will automatically use the `production` settings from the `browserslist` configuration during the build process.
- Docker deployment allows running the application in an isolated environment, which is ideal for consistency across different deployment environments. ch out if you have any issues or questions regarding the deployment process.