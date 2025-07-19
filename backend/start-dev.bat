@echo off
echo Checking for processes using port 5000...

REM Find and kill processes using port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not "%%a"=="0" (
        echo Killing process %%a using port 5000...
        taskkill /PID %%a /F
    )
)

echo Starting development server...
npm run dev
