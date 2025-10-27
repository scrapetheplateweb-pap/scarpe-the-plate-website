@echo off
echo Starting all ngrok tunnels with config file...

REM Start all tunnels at once using config file
ngrok start --all --config ngrok.yml

echo.
echo All tunnels started!
echo Check ngrok dashboard: https://dashboard.ngrok.com/cloud-edge/endpoints