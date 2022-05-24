#!/bin/sh

find . -type f -name '*.jpg' | while read -r line; do
    printf 'converting:\t%s' "$line"
    convert "$line" \( -clone 0 -resize 1280x720\! -blur 0x9 \) \( -clone 0 -resize 1280x720 \) -delete 0 -gravity center -compose over -composite -quality 75 "$line"
    echo
done
