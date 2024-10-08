# Installation guide and usage instructions for the SPATIAL Dashboard (Front-end)

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
- name: Configure Spatial Frontend v2
  hosts: "{{ target_host }}"
  become: yes
  tasks:
   - name: Update and upgrade apt packages
     apt:
     update_cache: yes
     upgrade: yes

   - name: Install required packages
     apt:
     name:
     - git
     - curl
     state: present
     update_cache: yes

   - name: Install Docker using official script
     shell: |
     curl -fsSL https://get.docker.com -o get-docker.sh
     sh get-docker.sh
     args:
     creates: /usr/bin/docker

   - name: Install Node.js and npm
     shell: |
     curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
     apt-get install -y nodejs
     args:
     creates: /usr/bin/node

   - name: Verify Node.js and npm installation
     command: "{{ item }}"
     with_items:
      - node --version
      - npm --version

   - name: Create the application directory on the remote VM
     file:
     path: "/home/ubuntu/spatial-frontendv2"
     state: directory
     mode: '0755'

   - name: Clone the repository into the application directory
     git:
     repo: "{{ repo_url }}"
     dest: "/home/ubuntu/spatial-frontendv2"
     update: yes

   - name: Clone the Spatial Frontend v2 repository
     git:
     repo: "{{ repo_url }}"
     dest: "{{ app_directory }}"
     update: yes

   - name: Copy .env file to the target VM
     copy:
     src: "../.env"
     dest: "{{ app_directory }}/.env"

   - name: Install npm dependencies
     command: npm install
     args:
     chdir: "{{ app_directory }}"

   - name: Stop any running Docker container on port 3000
     shell: docker ps --filter "publish=3000" --format "{{'{{.ID}}'}}" | xargs -r docker stop
     ignore_errors: true

   - name: Remove any stopped Docker containers on port 3000
     shell: docker ps -a --filter "status=exited" --filter "publish=3000" --format "{{'{{.ID}}'}}" | xargs -r docker rm
     ignore_errors: true

   - name: Kill any process using port 3000
     shell: lsof -t -i:3000 | xargs -r kill -9
     ignore_errors: true

   - name: Remove unused Docker resources to free up space
     shell: docker system prune -f
     ignore_errors: true

   - name: Build and run the Docker container
     shell: |
     docker build -t spatial-frontendv2 .
     docker run -d -p 3000:3000 --env-file .env -e DANGEROUSLY_DISABLE_HOST_CHECK=true spatial-frontendv2
     args:
     chdir: "{{ app_directory }}"

   - name: Ensure Docker container is running
     shell: docker ps | grep spatial-frontendv2
     register: container_status
     retries: 3
     delay: 5
     until: container_status.rc == 0

   - name: Output application URL
     debug:
     msg: "Spatial Frontend v2 is running at http://{{ ansible_host }}:3000"
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
         - name: Deploy to VM via SSH
           uses: appleboy/ssh-action@v0.1.8
           with:
             host: ${{ secrets.VM_IP }}
             username: ${{ secrets.SSH_USERNAME }}
             key: "${{ secrets.VM_SSH_KEY }}"
             # If using base64 encoding:
             # key: "${{ secrets.VM_SSH_KEY_BASE64 }}"
             # key_is_b64: true
             script: |
               # Navigate to the app directory or clone if it doesn't exist
               if [ -d ~/spatial-frontendv2 ]; then
                 cd ~/spatial-frontendv2
                 git pull origin main
               else
                 git clone https://github.com/mobile-cloud-computing/spartial-frontendv2.git ~/spatial-frontendv2
                 cd ~/spatial-frontendv2
               fi
   
               # Ensure Node.js (version 18) and npm are installed
               if ! command -v npm &> /dev/null; then
                 curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                 sudo apt-get install -y nodejs
               fi
   
               # Ensure Docker is installed
               if ! command -v docker &> /dev/null; then
                 sudo apt-get update
                 sudo apt-get install -y docker.io
                 sudo systemctl start docker
                 sudo systemctl enable docker
               fi
   
               # Kill any process running on port 3000
               if lsof -i:3000; then
                 sudo kill -9 $(lsof -t -i:3000) || true
               fi
   
               # Stop and remove any existing Docker container named 'spatial-app'
               if [ "$(docker ps -q -f name=spatial-app)" ]; then
                 docker stop spatial-app
                 docker rm spatial-app
               fi
   
               # Remove any Docker containers using port 3000
               if [ "$(docker ps -q -f publish=3000)" ]; then
                 docker stop $(docker ps -q -f publish=3000)
                 docker rm $(docker ps -q -f publish=3000)
               fi
   
               # Build Docker image
               docker build -t spatial-frontendv2 .
   
               # Run the Docker container
               docker run -d --name spatial-app -p 3000:3000 -e DANGEROUSLY_DISABLE_HOST_CHECK=true spatial-frontendv2
   ```

   - **Notes**:
      - Ensure you have set up the necessary secrets (`VM_SSH_KEY`, `VM_IP`, `SSH_USERNAME`) in the GitHub repository settings.
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


## How to Cite
-----------
This tool is open-source and contains the front-end of the SPATIAL Platform. The research is part of the SPATIAL project, funded by the European Union's Horizon 2020 research and innovation program under grant agreement No. 101021808.

- Ottun, Abdul-Rasheed, et al. ["The SPATIAL architecture: Design and development experiences from gauging and monitoring the AI inference capabilities of modern applications."](https://ieeexplore.ieee.org/abstract/document/10630929) *IEEE 44th International Conference on Distributed Computing Systems (ICDCS)*, 2024.

**BibTeX**
```bibtex
@inproceedings{ottun2024spatial,
  title={The SPATIAL architecture: Design and development experiences from gauging and monitoring the AI inference capabilities of modern applications},
  author={Ottun, Abdul-Rasheed and Marasinghe, Rasinthe and Elemosho, Toluwani and Liyanage, Mohan and Ragab, Mohamad and Bagave, Prachi and Westberg, Marcus and others},
  booktitle={2024 IEEE 44th International Conference on Distributed Computing Systems (ICDCS)},
  pages={947--959},
  year={2024},
  organization={IEEE}
}
```