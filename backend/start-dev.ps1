# Kill any processes using port 5000
$port = 5000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "Found processes using port $port. Killing them..."
    foreach ($processId in $processes) {
        try {
            Stop-Process -Id $processId -Force
            Write-Host "Killed process $processId"
        } catch {
            Write-Host "Could not kill process $processId"
        }
    }
} else {
    Write-Host "No processes found using port $port"
}

# Wait a moment for ports to be released
Start-Sleep -Seconds 2

# Start the development server
Write-Host "Starting development server..."
npm run dev
