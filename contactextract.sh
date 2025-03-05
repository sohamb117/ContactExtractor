#!/bin/bash

# React Project Setup Script

# Function to validate and create .env file
create_env_file() {
    local api_key="$1"
    local mode_path="$2"
    
    # Ensure the .env file uses the REACT_APP_ prefix and places the API key in quotes
    local env_content="REACT_APP_OPENAI_API_KEY=\"$api_key\""
    
    # Write to .env file in the specified directory
    local env_path="$mode_path/.env"
    
    echo "$env_content" > "$env_path"
    
    echo -e "Created .env file at $env_path"
}

# Clear the console and display welcome message
clear
echo -e "React Project Setup Script"
echo -e "========================="

# Prompt for mode selection
while true; do
    read -p "Enter mode (web/add-in): " mode
    mode=$(echo "$mode" | tr '[:upper:]' '[:lower:]')
    
    if [[ "$mode" == "web" || "$mode" == "add-in" ]]; then
        break
    fi
done

# Use current working directory as the base path
base_path=$(pwd)

# Construct the full path for the selected mode
mode_path="$base_path/$mode"

# Verify the mode directory exists
if [[ ! -d "$mode_path" ]]; then
    echo -e "Error: Directory $mode_path does not exist"
    exit 1
fi

# Change to the selected mode directory
cd "$mode_path" || exit 1
echo -e "Changed directory to $mode_path"

# Prompt for OpenAI API Key
while true; do
    read -p "Enter your OPENAI_API_KEY: " api_key
    
    if [[ -n "$api_key" ]]; then
        break
    fi
    
    echo -e "API Key cannot be empty. Please try again."
done

# Create .env file
create_env_file "$api_key" "$mode_path"

# Run npm install
echo -e "Running npm install..."
if ! npm install; then
    echo -e "Error during npm install"
    exit 1
fi
echo -e "npm install completed successfully"

# Run npm start
echo -e "Starting the application..."
npm start