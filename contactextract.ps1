# React Project Setup Script

# Function to validate and create .env file
function Create-EnvFile {
    param (
        [string]$ApiKey,
        [string]$ModePath
    )

    # Ensure the .env file uses the REACT_APP_ prefix
    $envContent = "REACT_APP_OPENAI_API_KEY=""$ApiKey"""
    
    # Write to .env file in the specified directory
    $envPath = Join-Path -Path $ModePath -ChildPath ".env"
    $envContent | Out-File -FilePath $envPath -Encoding UTF8

    Write-Host "Created .env file at $envPath" -ForegroundColor Green
}

# Clear the console and display welcome message
Clear-Host
Write-Host "React Project Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Prompt for mode selection
do {
    $mode = Read-Host "Enter mode (web/add-in)"
    $mode = $mode.ToLower()
} while ($mode -ne "web" -and $mode -ne "add-in")

# Use current working directory as the base path
$basePath = Get-Location

# Construct the full path for the selected mode
$modePath = Join-Path -Path $basePath -ChildPath $mode

# Verify the mode directory exists
if (-not (Test-Path -Path $modePath)) {
    Write-Host "Error: Directory $modePath does not exist" -ForegroundColor Red
    exit 1
}

# Change to the selected mode directory
try {
    Set-Location -Path $modePath
    Write-Host "Changed directory to $modePath" -ForegroundColor Green
}
catch {
    Write-Host "Error changing directory: $_" -ForegroundColor Red
    exit 1
}

# Prompt for OpenAI API Key
do {
    $apiKey = Read-Host "Enter your OPENAI_API_KEY"
    if ([string]::IsNullOrWhiteSpace($apiKey)) {
        Write-Host "API Key cannot be empty. Please try again." -ForegroundColor Yellow
    }
} while ([string]::IsNullOrWhiteSpace($apiKey))

# Create .env file
Create-EnvFile -ApiKey $apiKey -ModePath $modePath

# Run npm install
Write-Host "Running npm install..." -ForegroundColor Cyan
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "npm install completed successfully" -ForegroundColor Green
}
catch {
    Write-Host "Error during npm install: $_" -ForegroundColor Red
    exit 1
}

# Run npm start
Write-Host "Starting the application..." -ForegroundColor Cyan
try {
    npm start
}
catch {
    Write-Host "Error starting the application: $_" -ForegroundColor Red
    exit 1
}