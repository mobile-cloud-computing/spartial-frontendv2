# Running Guide for Spatial Frontend v2 Locally

This guide provides a step-by-step approach to running the Spatial Frontend v2 application locally. It covers running the application directly using Node.js and npm, using Docker to run it in a container, and automating the setup using an Ansible playbook.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v16.x or later)
- **npm** (v8.x or later)
- **Git**
- **Docker** (for containerized deployment)
- **Ansible** (for automated configuration)

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
   REACT_APP_OKTA_REDIRECT_URI=http://localhost:3000/login/callback
   REACT_APP_API_GATEWAY_HOST=api_gateway_host
   REACT_APP_API_GATEWAY_PORT=8000
   ```

   Ensure these variables are correctly set to match your local environment.

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

4. **Customizing Environment Variables (Optional)**
6. **Customizing Environment Variables (Optional)**

   Adjust the environment variables in the Dockerfile or pass them at runtime using the `--env-file` option:

   ```bash
   docker run -p 3000:3000 --env-file .env spatial-frontendv2
   ```

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
             - docker.io
           state: present

       - name: Install Node.js and npm
         shell: |
           curl -sL https://deb.nodesource.com/setup_16.x | bash -
           apt-get install -y nodejs
         args:
           creates: /usr/bin/node

       - name: Verify Node.js and npm installation
         command: "{{ item }}"
         with_items:
           - node --version
           - npm --version

       - name: Clone the Spatial Frontend v2 repository
         git:
           repo: "{{ repo_url }}"
           dest: "{{ app_directory }}"
           update: yes

       - name: Install npm dependencies
         command: npm install
         args:
           chdir: "{{ app_directory }}"

       - name: Create environment file from template
         template:
           src: .env.j2
           dest: "{{ app_directory }}/.env"

       - name: Build and run the Docker container
         shell: |
           docker build -t spatial-frontendv2 .
           docker run -d -p 3000:3000 spatial-frontendv2
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

2. **Create the Environment Variables Template**

   Create a file named `.env.j2` in the same directory as the playbook with the following content:

   ```env
   REACT_APP_OKTA_CLIENT_ID={{ okta_client_id }}
   REACT_APP_OKTA_ISSUER={{ okta_issuer }}
   REACT_APP_OKTA_SCOPES={{ okta_scopes }}
   REACT_APP_OKTA_PKCE={{ okta_pkce }}
   REACT_APP_OKTA_DISABLE_HTTPS_CHECK={{ okta_disable_https_check }}
   REACT_APP_OKTA_REDIRECT_URI={{ okta_redirect_uri }}
   REACT_APP_API_GATEWAY_HOST={{ api_gateway_host }}
   REACT_APP_API_GATEWAY_PORT={{ api_gateway_port }}
   ```

3. **Create a Variables File**

   Create a file named `spatial_vars.yml` with your environment variables:

   ```yaml
   target_host: "vm_ip_or_hostname"
   okta_client_id: "okta_client_id"
   okta_issuer: "okta_issuer"
   okta_scopes: "openid profile email"
   okta_pkce: "true"
   okta_disable_https_check: "true"
   okta_redirect_uri: "http://vm_ip_or_hostname:3000/login/callback"
   api_gateway_host: "api_gateway_host"
   api_gateway_port: "8000"
   ```

4. **Run the Ansible Playbook**

   Execute the playbook using the following command:

   ```bash
   ansible-playbook -i hosts configure_spatial_frontend.yml -e "@spatial_vars.yml"
   ```

   Replace `hosts` with your Ansible inventory file that includes the target VM.

5. **Access the Application**

   The application should now be running on your VM at `http://vm_ip_or_hostname:3000`.

#### Notes

- **Dynamic Variables**: The playbook is designed to use dynamic variables. You can modify the `spatial_vars.yml` file or pass variables directly via the command line.
- **No Static Vars**: The playbook does not contain static variable definitions, allowing for flexible configuration.

### Setting Up Environment Variables

The application uses environment variables for configuration. Ensure that you correctly set these variables either in the `.env` file (for local and Docker setups) or via the Ansible variables file.

### Troubleshooting

If you encounter issues while running the application locally, using Docker, or with the Ansible playbook, consider the following:

- **Dependencies**: Verify that all dependencies are installed without errors by checking the output of `npm install` or the Ansible playbook run.
- **Docker**: If using Docker, check the container logs for errors using `docker logs <container_id>`.
- **Ansible**: Check the playbook output for any error messages and ensure that SSH access to the target VM is configured correctly.
- **Environment Variables**: Ensure all required variables are correctly set and formatted in your `.env` file or variables file.