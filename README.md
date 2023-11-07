# Spatial Frontend

This is the Frontend for spatial


## Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn package manager
- Okta developer account for authentication setup
- Docker installed if you wish to containerize the application

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/toluelemson/spartial-frontendv2.git
cd spartial-frontendv2
```

Install the necessary dependencies:

```bash
npm install
```

or if you're using Yarn:

```bash
yarn install
```

## Configuration

Create a `.env` file in the root directory of your project and add Okta configuration details:

```env
REACT_APP_OKTA_CLIENT_ID=yourOktaClientId
REACT_APP_OKTA_ISSUER=yourOktaIssuerUrl
```

## Running the Application Locally

Start the development server:

```bash
npm run start
```

or with Yarn:

```bash
yarn start
```

The application will open in your default web browser at `http://localhost:3000`.

## Docker Support

### Building the Docker Image

To build a Docker image of your application, run:

```bash
docker build -t spatial .
```

### Running the Docker Container

To run your application as a Docker container:

```bash
docker run -p 3000:3000 spatial 
```

Your app will now be accessible at `http://localhost:3000`.


## Building for Production

To create a production build of the application:

```bash
npm run build
```

or with Yarn:

```bash
yarn build
```

This will generate a `build` folder with your compiled application.

## Contributing

We welcome contributions to this project. Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/Feature`).
3. Make changes and commit them (`git commit -m 'Add some Feature'`).
4. Push to the branch (`git push origin feature/Feature`).
5. Open a Pull Request.