@echo off

cd backend
start /B cmd /c "npm run dev"
cd../

cd app
start cmd /c "npm run dev"
cd ../

start http://localhost:5173/
