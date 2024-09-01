### Local Development Setup
- Fork clone the project
- Run `npm install `
- Change directory to client
- Run `npm install` to install client side dependencies.

### Starting the server

> Create a new `.env` file at the root, and copy paste the contents of the `.env.example` file.

Get MongoDB string from your MongoDB Atlas account.

Get an API key from your Resend account.

For starting the server move to the *server* directory and run `npm start`
While working in DEVELOPMENT Environment, use `npm run dev`, the server will watch for file changes in the `src` and `client` direcotories and automatically restart the server, though you have to refresh the page on the browser.
>Note that the above method would only start the server and serve the client side files (No HMR support).

### For Frontend Development only (HMR support)
Move to the *client* folder and run `npm run dev`. After working on frontend, run the "start" or "dev" scripts from the root to start the server and serve the build files.