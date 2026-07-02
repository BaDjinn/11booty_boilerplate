#!/usr/bin/env bash
set -euo pipefail

OUT="11bootyRepoDump.dat"
rm -f "$OUT"

{
  echo "===== TREE ====="
  tree -a -I "node_modules|public|.git|.cache|$OUT"
  echo
  echo "===== FILES ====="
  git ls-files | while IFS= read -r file; do
    case "$file" in
      "$OUT"|repoDump.txt|package-lock.json) continue ;;
    esac
    echo
    echo "===== FILE: $file ====="
    sed 's/	/    /g' "$file"
  done
} > "$OUT"