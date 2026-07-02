# 11ty Bootstrap Boilerplate

Template minimale per siti statici basati su Eleventy 3 e Bootstrap 5.

## Requisiti

- Node.js 24 LTS consigliato
- npm incluso con Node.js

## Avvio

```bash
npm ci
npm run dev
Build
npm run build
```

L'output statico viene generato in public/.

Note tecniche
Bootstrap viene installato da npm e copiato in public/assets/vendor/bootstrap/ durante la build.
Non vengono caricati jQuery, Popper separato o versioni miste di Bootstrap.
Le immagini gestite dagli shortcode vengono ottimizzate con @11ty/eleventy-img.
La pagina 404 viene generata da Eleventy con permalink /404.html.

---

## `repoDump.sh`

```bash
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

```
