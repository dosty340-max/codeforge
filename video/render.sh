#!/bin/zsh
# Renders video/scenes.aep to web-ready files in public/video.
set -euo pipefail

root="${0:A:h:h}"
aerender="/Applications/Adobe After Effects 2026/aerender"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
mkdir -p "$root/public/video"

for comp in network plan build verify; do
  "$aerender" -project "$root/video/scenes.aep" -comp "$comp" -output "$work/$comp.mp4" -sound OFF
  ffmpeg -y -loglevel error -i "$work/$comp.mp4" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an "$root/public/video/$comp.mp4"
  ffmpeg -y -loglevel error -ss 5 -i "$root/public/video/$comp.mp4" -frames:v 1 -q:v 4 "$root/public/video/$comp.jpg"
done

ls -lh "$root/public/video"
