#!/bin/bash
# review-feature.sh — review & push fitur
# Usage: ./review-feature.sh nama-fitur

FEATURE="${1:?Usage: $0 <nama-fitur>}"
BRANCH="feature/${FEATURE}"

cd "$(dirname "$0")"

CURRENT=$(git branch --show-current)
if [ "$CURRENT" != "$BRANCH" ]; then
  echo "Switching ke ${BRANCH}..."
  git checkout "$BRANCH"
fi

echo ""
echo "========================================="
echo "  REVIEW: ${FEATURE}"
echo "  Branch: ${BRANCH}"
echo "========================================="
echo ""

# Tampilkan perubahan vs main
echo "--- FILE YANG BERUBAH ---"
git diff --stat main...HEAD
echo ""

echo "--- DETAIL PERUBAHAN ---"
git diff main...HEAD --color=always | less -R

echo ""
read -p "Push ke GitHub? (y/n): " CONFIRM
if [ "$CONFIRM" = "y" ]; then
  git push -u origin "$BRANCH"
  echo ""
  echo "✓ Branch terpush. Buat PR di:"
  echo "  https://github.com/obirmd/umkm-wifi-portal/compare/main...${BRANCH}"
else
  echo "Dibatalkan."
fi
