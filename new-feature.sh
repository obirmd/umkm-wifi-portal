#!/bin/bash
# new-feature.sh — buat branch baru per fitur
# Usage: ./new-feature.sh nama-fitur

FEATURE="${1:?Usage: $0 <nama-fitur>}"
BRANCH="feature/${FEATURE}"

cd "$(dirname "$0")"

# Pull latest main dulu
git checkout main && git pull origin main

# Buat & pindah ke branch baru
git checkout -b "$BRANCH"

echo "✓ Branch: ${BRANCH}"
echo "  Kerjakan fitur di sini. Selesai review:"
echo "    ./review-feature.sh ${FEATURE}"
