# Running Guide for Spatial Frontend v2

This guide provides a step-by-step approach to running the Spatial Frontend v2 application. It covers running the application locally using Node.js and npm, using Docker for containerized deployment, automating the deployment on a target VM using Ansible, and setting up a continuous deployment workflow with GitHub Actions.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v18.x or later)
- **npm** (v8.x or later)
- **Git**
- **Docker** (for containerized deployment)
- **Ansible** (optional, for automated deployment to a VM)

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

   Create a `.env` file in the root of your project and add the necessary environment variables. Replace placeholders with your actual configuration values:

   ```env
   REACT_APP_OKTA_CLIENT_ID=your_okta_client_id
   REACT_APP_OKTA_ISSUER=your_okta_issuer
   REACT_APP_OKTA_SCOPES=openid profile email
   REACT_APP_OKTA_PKCE=true
   REACT_APP_OKTA_DISABLE_HTTPS_CHECK=true
   REACT_APP_OKTA_REDIRECT_URI=http://your_ip:your_port/login/callback
   REACT_APP_API_GATEWAY_HOST=your_api_gateway_host
   REACT_APP_API_GATEWAY_PORT=your_api_gateway_port
   ```

   - **Note**: Replace `your_okta_client_id`, `your_okta_issuer`, `your_ip`, `your_port`, `your_api_gateway_host`, and `your_api_gateway_port` with your actual configuration values.

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

   # Copy package.json and package-lock.json
   COPY package*.json ./

   # Install dependencies
   RUN npm install

   # Copy the rest of the application code
   COPY . .

   # Build the React application
   RUN npm run build

   # Install a simple static file server to serve the build artifacts
   RUN npm install -g serve

   # Expose port 5000 (default port used by 'serve')
   EXPOSE 5000

   # Set the command to serve the build artifacts
   CMD ["serve", "-s", "build", "-l", "5000"]
   ```

   - **Note**: This Dockerfile builds the React application and serves the static files using a lightweight Node.js static file server.

4. **Build the Docker Image**

   Build the Docker image by running the following command in the project's root directory:

   ```bash
   docker build -t spatial-frontendv2 .
   ```

5. **Run the Docker Container**

   Start the container using:

   ```bash
   docker run -p 5000:5000 --env-file .env spatial-frontendv2
   ```

   The application will be accessible at `http://localhost:5000`.

6. **Customizing Environment Variables (Optional)**

   Adjust the environment variables by modifying the `.env` file or passing them at runtime using the `--env-file` option.

   - **Note**: Ensure that the environment variables are set before the build step, as React applications embed these variables at build time.

### Option 3: Automated Deployment to a VM Using Ansible

Use Ansible to automate the setup, configuration, and deployment of the Spatial Frontend v2 application on a target VM.

#### Steps to Deploy with Ansible

1. **Set Up Inventory File**

   Create an inventory file named `hosts` in your Ansible directory and specify the target VM's IP and SSH details:

   ```ini
   [web]
   target_vm_ip ansible_user=your_username ansible_ssh_private_key_file=~/.ssh/id_rsa
   ```

   - **Note**: Replace `target_vm_ip` with your VM's IP address and `your_username` with the SSH username.

2. **Create a Variables File**

   Create a `spatial_vars.yml` file to store variables for the playbook:

   ```yaml
   target_host: "web"
   repo_url: "https://github.com/mobile-cloud-computing/spatial-frontendv2.git"
   app_directory: "~/spatial-frontendv2"
   ```
   
3. **Set Up Environment Variables**

   Place the `.env` file in the same directory as your Ansible playbook. It should contain the necessary environment variables.

4. **Create the Ansible Playbook**

   Create an Ansible playbook named `configure_spatial_frontend.yml` with the following content:

   ```yaml
   ---
   - hosts: "{{ target_host }}"
     become: yes
     vars:
       node_version: "18.x"
     tasks:
       - name: Update and upgrade apt packages
         apt:
           update_cache: yes
           upgrade: dist

       - name: Install required packages
         apt:
           name:
             - git
             - curl
             - build-essential
           state: present

       - name: Install Node.js
         shell: |
           curl -fsSL https://deb.nodesource.com/setup_{{ node_version }} | bash -
           apt-get install -y nodejs
         args:
           executable: /bin/bash

       - name: Clone the repository
         git:
           repo: "{{ repo_url }}"
           dest: "{{ app_directory }}"
           version: main
           force: yes

       - name: Copy .env file
         copy:
           src: .env
           dest: "{{ app_directory }}/.env"

       - name: Install npm dependencies
         npm:
           path: "{{ app_directory }}"
           production: false

       - name: Install PM2 globally
         npm:
           name: pm2
           global: yes

       - name: Start the application with PM2
         shell: |
           pm2 delete spatial-app || true
           pm2 start npm --name spatial-app -- start
           pm2 save
         args:
           chdir: "{{ app_directory }}"

       - name: Configure PM2 to start on boot
         shell: pm2 startup systemd -u {{ ansible_user }} --hp {{ app_directory }}
   ```

5. **Run the Ansible Playbook**

   Execute the playbook to configure and deploy the application:

   ```bash
   ansible-playbook -i hosts configure_spatial_frontend.yml -e "@spatial_vars.yml"
   ```

   The playbook will:

   - Update and upgrade `apt` packages.
   - Install necessary software (`git`, `curl`, Node.js, npm, PM2).
   - Clone the repository into the specified directory on the target VM.
   - Copy the `.env` file to the application directory.
   - Install npm dependencies.
   - Start the application using PM2 and configure it to start on boot.

6. **Access the Application**

   The application will be accessible at `http://<target_vm_ip>:3000`.

### Option 4: Continuous Deployment with GitHub Actions

Automate the deployment process using GitHub Actions to deploy your application to a VM whenever changes are pushed to the repository.

#### Steps to Set Up GitHub Actions Workflow

1. **Create the Deployment Workflow File**

   Create a new file in your repository at `.github/workflows/deploy.yml` with the following content:

   ```yaml
   name: Auto Deploy to VM
   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         # Step 1: Check out the repository
         - name: Checkout Repository
           uses: actions/checkout@v3

         # Step 2: Set up SSH agent with private key
         - name: Set up SSH
           uses: webfactory/ssh-agent@v0.5.4
           with:
             ssh-private-key: ${{ secrets.VM_SSH_KEY }}

         # Step 3: Deploy to VM
         - name: Deploy to VM
           env:
             VM_IP: ${{ secrets.VM_IP }}
             SSH_USERNAME: ${{ secrets.SSH_USERNAME }}
           run: |
             ssh -o StrictHostKeyChecking=no $SSH_USERNAME@$VM_IP '
               cd ~/spatial-frontendv2 || git clone https://github.com/mobile-cloud-computing/spatial-frontendv2.git ~/spatial-frontendv2
               cd ~/spatial-frontendv2
               git pull origin main
               if ! command -v npm &> /dev/null; then
                 curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                 sudo apt-get install -y nodejs
               fi
               if ! command -v pm2 &> /dev/null; then
                 sudo npm install -g pm2
               fi
               npm install
               pm2 delete spatial-app || true
               pm2 start npm --name spatial-app -- start
               pm2 save
             '
   ```

   - **Notes**:
      - Ensure you have set up the necessary secrets (`VM_SSH_KEY`, `VM_IP`, `SSH_USERNAME`) in your GitHub repository settings.
      - This workflow checks if Node.js and PM2 are installed and installs them if they are not.
      - The application is started using PM2 for process management.

2. **Configure Secrets in GitHub**

   - **VM_SSH_KEY**: The private SSH key used to connect to your VM.
   - **VM_IP**: The IP address of your VM.
   - **SSH_USERNAME**: The SSH username for your VM.

3. **Push Changes to the Repository**

   When you push changes to the `main` branch, the GitHub Actions workflow will automatically deploy the updated application to your VM.

## Setting Up Environment Variables

The application uses environment variables for configuration. Ensure that you correctly set these variables in the `.env` file for local, Docker, Ansible, and GitHub Actions setups.

- **Important**: For Docker and build processes, environment variables must be available at build time because React embeds these variables during the build.

## Troubleshooting

If you encounter issues while running the application:

- **Dependencies**: Ensure all dependencies are installed without errors (use `npm install` or check Ansible task output).
- **Docker**: Check container logs for errors using `docker logs <container_id>`.
- **Ansible**: Verify SSH access and that the target VM has the required permissions for installing software.
- **GitHub Actions**:
   - Ensure all required secrets are correctly set.
   - Check the workflow logs for any errors during deployment.
- **Environment Variables**: Confirm that the `.env` file is correctly populated and accessible.
- **Ports**: Make sure that the ports you're using are open and not blocked by firewalls.