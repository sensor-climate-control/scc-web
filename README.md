# scc-web
Web frontend and backend repository for the Oregon State University Sensor-Based In-Home Climate Control Capstone Project

You can view the API Specification for our backend API [here](https://osuscc-api.zimmerman.dev/docs/)

## Development

Install [NodeJS](https://nodejs.org/en/download/) and ensure you have [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

Clone this repository
```bash
git clone git@github.com:sensor-climate-control/scc-web.git
cd scc-web
```
Install the dependencies
```bash
npm install
```
Open one terminal window to run the NodeJS backend (with nodemon to reload on code change)
```bash
npm run dev
```
Open another terminal window to run the ReactJS frontend (in development mode to reload on code change)
```bash
npm run react
```
ReactJS should automatically open a browser window.

If it does not, open your web browser and navigate to the URL listed in the ReactJS terminal window

## Self-hosting

The supported method of self-hosting is using Docker Compose:

### Setup Steps:
1. Install [Docker Engine](https://docs.docker.com/engine/install/)
2. (optional) including the [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/)
3. Clone this repository:
```bash
git clone git@github.com:sensor-climate-control/scc-web.git
cd scc-web
```
4. Rename `example.env` to `.env` and enter the proper information
    - Create an [OpenWeatherMap](https://openweathermap.org/api) account and API Key. Enter the API key into the OWM_API_KEY field.
    - Generate a secret for the authentication provider and enter it into the JWT_SECRET field. You can obtain sufficiently random strings from the [Wordpress API](https://api.wordpress.org/secret-key/1.1/salt/), or you can generate it with a terminal command like `pwgen -s 32 1`
    - Set MONGO_ROOT_USER and MONGO_ROOT_PASSWORD to a username and password of your choice (they will be used by the web server to communicate with the MongoDB database)
    - Set WEB_ADMIN_EMAIL and WEB_ADMIN_PASS to an email and password of your choice. This will be the initial administrator account that you can use to interact with the API.
    - You can use your own mail server, or use an email service like Gmail as the SMTP relay
    - If you're using Gmail, you have to set up an App Password:
        1. Go to https://security.google.com/settings/security/apppasswords
        2. Under "Select the app and device you want to generate the app password for.", select "Mail" as the app and "Other (custom name)" as the device. Enter an identifiable name. Then click Generate.
        3. Copy this app password and enter it into the SMTP_PASS field of .env
    - Using Gmail, .env would look something like this:
```bash
OWM_API_KEY="OpenWeatherMapApiKey"
JWT_SECRET="FakeSecret"
MONGO_ROOT_USER="root"
MONGO_ROOT_PASSWORD="password"
WEB_ADMIN_EMAIL="example@gmail.com"
WEB_ADMIN_PASS="password"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="example@gmail.com"
SMTP_PASS="exampleapppassword"
SMTP_FROM="'Alerts' <example@gmail.com>"
```
5. Run `docker compose up -d`  (will likely take a few minutes to run)
6. Success! The web server is now available at http://localhost:3001
