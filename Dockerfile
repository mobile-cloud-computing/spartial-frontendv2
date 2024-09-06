FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV REACT_APP_ENV=development

# Okta environment variables
ENV REACT_APP_OKTA_CLIENT_ID=0oaj48o7u4daHt11G5d7
ENV REACT_APP_OKTA_ISSUER=https://dev-00933063.okta.com/oauth2/default
ENV REACT_APP_OKTA_REDIRECT_URI=https://dev-00933063.okta.com/login/callback
ENV REACT_APP_OKTA_SCOPES="openid profile email"
ENV REACT_APP_OKTA_PKCE=true
ENV REACT_APP_OKTA_DISABLE_HTTPS_CHECK=true

# Alternative Okta settings
ENV REACT_APP_OKTA_REDIRECT_URI=http://193.40.154.121:3000/login/callback
ENV REACT_APP_OKTA_CLIENT_ID=0oad47hh57j7vUiRt5d7
ENV REACT_APP_OKTA_ISSUER=https://dev-59181526.okta.com/oauth2/default

# Server settings
ENV SERVER_URL=https://193.40.154.143
ENV SERVER_HOST=193.40.154.143
ENV SERVER_PORT=8000

# Public URL settings
ENV PUBLIC_URL=https://mobile-cloud-computing.github.io

# Command to run the app
CMD ["npm", "start"]
