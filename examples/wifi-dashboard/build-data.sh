#!/bin/sh
# Rigenera data/ dal template UI/index.html e dal toolkit css/vv-ui/.
# Serve solo dopo aver modificato la UI: i file in data/ sono già pronti.

set -e
cd "$(dirname "$0")"
ROOT=../..
mkdir -p data

cat "$ROOT/css/vv-ui/tokens.css" \
    "$ROOT/css/vv-ui/base.css" \
    "$ROOT/css/vv-ui/layout.css" \
    "$ROOT/css/vv-ui/components.css" \
    "$ROOT/css/vv-ui/dashboard.css" \
    "$ROOT/css/vv-ui/motion.css" > data/vasovivo.css

cp "$ROOT/js/vv-data.js" "$ROOT/js/vv-dashboard.js" data/
cp "$ROOT/img/logo-small.png" data/logo.png

# Sulla rete dell'ESP32 non c'è internet: via i font Google e i link al sito.
sed -e '/<!-- vv:online -->/,/<!-- \/vv:online -->/d' \
    -e '/<!-- vv:site -->/,/<!-- \/vv:site -->/d' \
    -e 's|\.\./css/style\.css|vasovivo.css|' \
    -e 's|\.\./js/||' \
    -e 's|\.\./img/logo-small\.png|logo.png|' \
    -e 's|href="\.\./index\.html"|href="/"|' \
    -e 's|data-source="demo"|data-source="/api/readings"|' \
    "$ROOT/UI/index.html" > data/index.html

# Rimuove eventuali residui della vecchia vista illustrata
rm -f data/jar.html data/vv-jar.js

echo "data/ aggiornata:"
ls -l data
