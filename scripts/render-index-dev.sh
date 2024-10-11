#!/bin/bash

if [ ! -f "stored-files/index.html" ]; then
  echo "Creating placeholder index.html..."
  sed \
    -e 's/SCRIPT_PATH/\/src\/entry-client.ts/g' \
    -e 's/STYLE_PATH/\/src\/style.css/g' \
    -e 's/<!--content-->/Edit me/g' "src/template.html" \
    > "stored-files/index.html"
fi
