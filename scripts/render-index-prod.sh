#!/bin/bash

sed -e 's/SCRIPT_PATH/\/src\/entry-client.ts/g' -e 's/<!--content-->/Edit me/g' "src/template.html" > "index.html"
