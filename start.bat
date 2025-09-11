@echo off
echo ============================
echo Starting MongoDB Seeder...
echo ============================
cd Medica\Server
node seed.js

echo ============================
echo Starting Node.js Server...
echo ============================
start cmd /k "node Server.js"

echo ============================
echo Starting Python AI Tools...
echo ============================
cd AI-TOOLS
start cmd /k "python run.py"

echo All services launched.
pause
