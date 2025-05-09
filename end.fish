#!/usr/bin/env fish

# Kill all node processes
echo "Killing all node processes..."
pkill -f node

# Kill all firebase processes
echo "Killing all firebase processes..."
pkill -f firebase

# Wait for processes to end
echo "Waiting for processes to terminate..."
sleep 5

echo "Quitting Chrome and VSCode..."
osascript -e 'quit app "Google Chrome"'
osascript -e 'quit app "Visual Studio Code"'

echo "Closing iTerm2 windows..."
osascript -e '
tell application "iTerm"
    try
        close window 2
        close window 3
    end try
end tell'

echo "Done!"
