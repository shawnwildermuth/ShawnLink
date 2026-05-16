function StopIf() {
  if ($LASTEXITCODE) { Stop }
}

$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $true
az acr login -n wmcontainers
StopIf
cd ..\shawnlinkadmin
npm ci
StopIf
npm run build
StopIf
cd -
npm ci
StopIf
npm run build
StopIf
docker build . -t wmcontainers.azurecr.io/shawnlink:latest
StopIf
docker push wmcontainers.azurecr.io/shawnlink:latest
