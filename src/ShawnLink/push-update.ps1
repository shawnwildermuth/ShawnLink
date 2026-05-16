$ErrorActionPreference = "Stop"
cd ..\shawnlinkadmin
npm ci
npm run build
cd -
npm ci
npm run build
docker build . -t wmcontainers.azurecr.io/shawnlink:latest
docker push wmcontainers.azurecr.io/shawnlink:latest
