## All videos are shown in main branch README

# Work Done
- Frontend and backend integrated test.
- Adjust some parameters from original version (both frontend and backend).
- Optimize file storage structure.
- Optimize the search function implemented by elastic search.
- Clearify more specifically to different rols (Casbin ruls).
- Adding more test cases for all the new functionality implemented.
- Completed all expected interfaces, functions, interactions.
- Ran a thorough test on page redirection and every function.

## How to run
- [Docker Deployment](https://github.com/fongziyjun16/SE/wiki/Docker-Deployment).

- Backend Server Deployment

  - Installation of Go in remote server.
  - Copy the whole **GFBackend** folder to the remote server.
  - `cd` into GFBackend, run `go build main.go`
  - After building, run `./main`, then the GFBackend Server has been started up.

- Frontend Server Deployment
  - Installation of NodeJS in remote server.
  - Copy the whole **GFfrontend** folder to the remote server.
  - `cd` into **GFfrontend** folder and run
  - `npm install`
  - `npm run build`
  - `npm run serve`
  - Frontend Server will start and the port will be displayed


