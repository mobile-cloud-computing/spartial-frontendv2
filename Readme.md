# Running Guide for Spatial Frontend v2

This guide provides a step-by-step approach to running the Spatial Frontend v2 application. It covers running the application locally using Node.js and npm, using Docker for containerized deployment, and automating the deployment on a target VM using Ansible.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v16.x or later)
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

   Create a `.env` file in the root of your project and add the necessary environment variables:

   ```env
   REACT_APP_OKTA_CLIENT_ID=okta_client_id
   REACT_APP_OKTA_ISSUER=okta_issuer
   REACT_APP_OKTA_SCOPES=openid profile email
   REACT_APP_OKTA_PKCE=true
   REACT_APP_OKTA_DISABLE_HTTPS_CHECK=true
   REACT_APP_OKTA_REDIRECT_URI=http://ip:port/login/callback
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
   docker run -p 3000:3000 --env-file .env spatial-frontendv2
   ```

   The application will be accessible at `http://localhost:3000`.

6. **Customizing Environment Variables (Optional)**

   Adjust the environment variables in the Dockerfile or pass them at runtime using the `--env-file` option.

### Option 3: Automated Deployment to a VM Using Ansible

Use Ansible to automate the setup, configuration, and deployment of the Spatial Frontend v2 application on a target VM.

#### Steps to Deploy with Ansible

1. **Set Up Inventory File**

   Create an inventory file named `hosts` in the Ansible directory and specify the target VM's IP and SSH details:

   ```ini
   [web]
   target_vm_ip ansible_user=your_username ansible_ssh_private_key_file=~/.ssh/id_rsa
   ```

   Replace `target_vm_ip` with your VM's IP address and `your_username` with the SSH username.

2. **Create a Variables File**

   Create a `spatial_vars.yml` file to store variables for the playbook:

   ```yaml
   target_host: "web"
   repo_url: "https://github.com/mobile-cloud-computing/spatial-frontendv2.git"
   app_directory: "~/spartial-frontendv2"
   ```

3. **Set Up Environment Variables**

   Place the `.env` file in the parent directory of your Ansible playbook. It should contain the necessary environment variables.

4. **Run the Ansible Playbook**

   Execute the playbook to configure and deploy the application:

   ```bash
   ansible-playbook -i hosts configure_spatial_frontend.yml -e "@spatial_vars.yml"
   ```

   The playbook will:
   - Update and upgrade `apt` packages.
   - Install necessary software (`git`, `curl`, Docker, Node.js, npm).
   - Clone the repository into the specified directory on the target VM.
   - Copy the `.env` file to the application directory.
   - Install npm dependencies.
   - Clean up existing Docker containers on port 3000.
   - Build and run the Docker container, exposing it on port 3000.

5. **Access the Application**

   The application will be accessible at `http://<target_vm_ip>:3000`.

## Setting Up Environment Variables

The application uses environment variables for configuration. Ensure that you correctly set these variables either in the `.env` file (for local, Docker, and Ansible setups).

## Troubleshooting

If you encounter issues while running the application:

- **Dependencies**: Ensure all dependencies are installed without errors (use `npm install` or check Ansible task output).
- **Docker**: Check container logs for errors using `docker logs <container_id>`.
- **Ansible**: Verify SSH access and that the target VM has the required permissions for installing software.
- **Environment Variables**: Confirm that the `.env` file is correctly populated and accessible.