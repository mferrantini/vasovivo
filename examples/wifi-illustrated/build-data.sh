#!/bin/sh
# Rigenera data/ dal template UI/v2/index.html e dal toolkit css/vv-ui-v2/.
# Serve solo dopo aver modificato la UI: i file in data/ sono già pronti.

set -e
cd "$(dirname "$0")"
ROOT=../..
mkdir -p data

cat "$ROOT/css/vv-ui-v2/tokens.css" \
    "$ROOT/css/vv-ui-v2/base.css" \
    "$ROOT/css/vv-ui-v2/layout.css" \
    "$ROOT/css/vv-ui-v2/illustration.css" \
    "$ROOT/css/vv-ui-v2/readings.css" \
    "$ROOT/css/vv-ui-v2/components.css" \
    "$ROOT/css/vv-ui-v2/utilities.css" \
    "$ROOT/css/vv-ui-v2/motion.css" > data/vasovivo.css

cp "$ROOT/js/vv-data.js" data/vv-data.js
cp "$ROOT/js/v2/vv2-jar.js" data/vv2-jar.js
cp "$ROOT/img/logo-small.png" data/logo.png

# Sulla rete dell'ESP32 non c'è internet: via i font Google e i link al sito.
sed -e '/<!-- vv:online -->/,/<!-- \/vv:online -->/d' \
    -e '/<!-- vv:site -->/,/<!-- \/vv:site -->/d' \
    -e 's|\.\./\.\./css/style-v2\.css|vasovivo.css|' \
    -e 's|\.\./\.\./js/vv-data\.js|vv-data.js|' \
    -e 's|\.\./\.\./js/v2/vv2-jar\.js|vv2-jar.js|' \
    -e 's|\.\./\.\./img/logo-small\.png|logo.png|' \
    -e 's|href="\.\./\.\./index\.html"|href="/"|' \
    -e 's|data-source="demo"|data-source="/api/readings"|' \
    "$ROOT/UI/v2/index.html" > data/index.html

echo "data/ aggiornata:"
ls -l data
