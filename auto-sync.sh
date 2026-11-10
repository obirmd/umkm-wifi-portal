#!/bin/bash
# auto-sync.sh — watch folder, auto commit & push on change
# Usage: ./auto-sync.sh [folder]
# Ctrl+C to stop

DIR="${1:-.}"
cd "$DIR" || exit 1

if ! command -v fswatch &>/dev/null; then
  echo "Installing fswatch..."
  brew install fswatch 2>/dev/null || { echo "Need brew or install fswatch manually"; exit 1; }
fi

echo "Watching: $(pwd)"
echo "Press Ctrl+C to stop"
echo "---"

fswatch -0 --exclude ".git/" --exclude "node_modules/" "$DIR" | while read -d "" event; do
  sleep 1 # debounce
  
  CHANGED=$(git diff --name-only HEAD)
  if [ -n "$CHANGED" ]; then
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    FILES=$(echo "$CHANGED" | tr '\n' ' ')
    MSG="auto: update ${TIMESTAMP} — ${FILES}"
    
    git add -A && git commit -m "$MSG" && git push
    echo "[${TIMESTAMP}] Pushed ✓"
  fi
done
