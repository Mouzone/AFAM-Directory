#!/usr/local/bin/fish

# Start Firebase local emulator
osascript -e '
tell application "iTerm"
    tell current window
        create tab with default profile
        tell current session to write text "cd ~/repos/AFAM-Directory && firebase emulators:start --import=test-data --export-on-exit=test-data"
    end tell
end tell'

# Start Next.js server
osascript -e '
tell application "iTerm"
    tell current window
        create tab with default profile
        tell current session to write text "cd ~/repos/AFAM-Directory/frontend && bun run dev"
    end tell
end tell'

# Open frontend in Chrome
open -a "Google Chrome" http://localhost:3000
code .
clear