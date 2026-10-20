#!/bin/sh
# Rigenera data/ dal template UI/index.html e dal toolkit css/vv-ui/.
# Serve solo dopo aver modificato la UI: i file in data/ sono già pronti.
# L'elenco CSS è letto dagli @import di css/style.css, così non va tenuto a mano.

set -e
cd "$(dirname "$0")"
ROOT=../..
mkdir -p data

# Concatena i moduli CSS nell'ordine dichiarato in style.css
: > data/vasovivo.css
sed -n "s|^@import url('\(vv-ui/[^'?]*\)[^']*');|\1|p" "$ROOT/css/style.css" | while IFS= read -r rel; do
  cat "$ROOT/css/$rel" >> data/vasovivo.css
  printf '\n' >> data/vasovivo.css
done

cp "$ROOT/js/vv-data.js" data/vv-data.js
cp "$ROOT/js/vv-jar.js" data/vv-jar.js
cp "$ROOT/img/logo-small.png" data/logo.png
cp "$ROOT/img/logo.svg" data/logo.svg

# Sulla rete dell'ESP32 non c'è internet: via i font Google e i link al sito.
sed -e '/<!-- vv:online -->/,/<!-- \/vv:online -->/d' \
    -e '/<!-- vv:site -->/,/<!-- \/vv:site -->/d' \
    -e 's|\.\./css/style\.css|vasovivo.css|' \
    -e 's|\.\./js/vv-data\.js|vv-data.js|' \
    -e 's|\.\./js/vv-jar\.js|vv-jar.js|' \
    -e 's|\.\./img/logo-small\.png|logo.png|' \
    -e 's|\.\./img/logo\.svg|logo.svg|' \
    -e 's|href="\.\./index\.html"|href="/"|' \
    -e 's|data-source="demo"|data-source="/api/readings"|' \
    "$ROOT/UI/index.html" > data/index.html

echo "data/ aggiornata:"
ls -l data
