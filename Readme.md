# Running Guide for Spatial Frontend v2 Locally

This guide provides a step-by-step approach to running the Spatial Frontend v2 application locally. It covers running the application directly using Node.js and npm, using Docker to run it in a container, and setting up automated deployment using GitHub Actions.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v16.x or later)
- **npm** (v8.x or later)
- **Git**
- **Docker** (for containerized deployment)
- **GitHub Repository with Secrets** (for automated deployment)

## Running Options

### Option 1: Run Locally with Node.js and npm

#### Steps to Run

1. **Clone the Repository**

   Clone the repository to your local environment:

   ```bash
   git clone https://github.com/mobile-cloud-computing/spatial-frontendv2.git
   cd spatial-frontendv2
   ```

2. **Install Dependencies**

   Install the project dependencies using npm:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root of your project and add the necessary environment variables:

   ```env
   REACT_APP_OKTA_CLIENT_ID=okta_client_id
   REACT_APP_OKTA_ISSUER=okta_issuer
   REACT_APP_OKTA_SCOPES=openid profile email
   REACT_APP_OKTA_PKCE=true
   REACT_APP_OKTA_DISABLE_HTTPS_CHECK=true
   REACT_APP_OKTA_REDIRECT_URI=http://vm_ip/login/callback
   REACT_APP_API_GATEWAY_HOST=api_gateway_host
   REACT_APP_API_GATEWAY_PORT=api_gateway_port
   ```

4. **Start the Application**

   Run the application locally using npm:

   ```bash
   npm start
   ```

   The application will start and be accessible at `http://localhost:3000`.

### Option 2: Running the Application in a Docker Container

#### Steps to Build and Run the Docker Container

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mobile-cloud-computing/spatial-frontendv2.git
   cd spatial-frontendv2
   ```

2. **Create a `.env` File**

   As in Option 1, create a `.env` file with the necessary environment variables.

3. **Create a Dockerfile**

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

4. **Build the Docker Image**

   Build the Docker image by running the following command in the project's root directory:

   ```bash
   docker build -t spatial-frontendv2 .
   ```

5. **Run the Docker Container**

   Start the container using:

   ```bash
   docker run -p 3000:3000 spatial-frontendv2
   ```

   The application will be accessible at `http://localhost:3000`.

6. **Customizing Environment Variables (Optional)**

   Adjust the environment variables in the Dockerfile or pass them at runtime using the `--env-file` option:

   ```bash
   docker run -p 3000:3000 --env-file .env spatial-frontendv2
   ```

### Option 4: Automated Deployment to VM Using GitHub Actions

You can set up automated deployment to your VM using GitHub Actions, allowing you to push changes to the `master` branch and automatically deploy them to your VM.

#### Steps to Set Up Automated Deployment

1. **Create GitHub Secrets**

   Go to your GitHub repository's settings and add the following secrets:

   - `VM_SSH_KEY`: The private SSH key for accessing the VM.
   - `VM_IP`: The IP address of your VM.
   - `SSH_USERNAME`: The username for SSH access on the VM.

2. **Create the Deployment Workflow File**

   Create a new file in your repository at `.github/workflows/deploy.yml` with the following content:

   ```yaml
   name: Auto Deploy to VM

   on:
     push:
       branches:
         - master

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
         # Step 1: Check out the repository
         - name: Checkout Repository
           uses: actions/checkout@v2

         # Step 2: Set up SSH agent with private key
         - name: Set up SSH
           uses: webfactory/ssh-agent@v0.5.3
           with:
             ssh-private-key: ${{ secrets.VM_SSH_KEY }}

         # Step 3: Deploy to VM
         - name: Deploy to VM
           env:
             VM_IP: ${{ secrets.VM_IP }}
             SSH_USERNAME: ${{ secrets.SSH_USERNAME }}
           run: |
             ssh -o StrictHostKeyChecking=no $SSH_USERNAME@$VM_IP "
               cd ~/spatial-frontendv2 || exit 1
               git pull origin master
               if ! command -v docker-compose &> /dev/null; then
                 sudo curl -L 'https://github.com/docker/compose/releases/download/v2.1.1/docker-compose-$(uname -s)-$(uname -m)' -o /usr/local/bin/docker-compose
                 sudo chmod +x /usr/local/bin/docker-compose
               fi
               if ! command -v npm &> /dev/null; then
                 curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
                 sudo apt-get install -y nodejs
               fi
               if ! command -v pm2 &> /dev/null; then
                 sudo npm install -g pm2
               fi
               sudo docker-compose down
               sudo docker-compose up -d --build
               sudo npm install
               pm2 describe spatial-app || pm2 start npm --name spatial-app -- run start
               pm2 restart spatial-app --update-env
             "
   ```

## Setting Up Environment Variables

The application uses environment variables for configuration. Ensure that you correctly set these variables either in the `.env` file (for local and Docker setups).

## Troubleshooting

If you encounter issues while running the application locally, using Docker, or GitHub Actions, consider the following:

- **Dependencies**: Verify that all dependencies are installed without errors by checking the output of `npm install`.
- **Docker**: If using Docker, check the container logs for errors using `docker logs <container_id>`.
- **GitHub Actions**: Check the Actions logs in your GitHub repository to debug the deployment process.
- **Environment Variables**: Ensure all required variables are correctly set in your `.env` file or the variables file.

