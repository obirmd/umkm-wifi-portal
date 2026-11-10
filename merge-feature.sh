#!/bin/bash
# merge-feature.sh — merge fitur ke main setelah review
# Usage: ./merge-feature.sh nama-fitur

FEATURE="${1:?Usage: $0 <nama-fitur>}"
BRANCH="feature/${FEATURE}"

cd "$(dirname "$0")"

echo "Merging ${BRANCH} → main..."
git checkout main && git pull origin main
git merge --no-ff "${BRANCH}" -m "merge: ${FEATURE}"
git push origin main

read -p "Hapus branch ${BRANCH}? (y/n): " DEL
if [ "$DEL" = "y" ]; then
  git branch -d "$BRANCH"
  git push origin --delete "$BRANCH" 2>/dev/null
  echo "✓ Branch dihapus."
fi

echo ""
echo "✓ Fitur '${FEATURE}' sudah di main."
