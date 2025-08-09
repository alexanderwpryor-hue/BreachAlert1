#!/bin/zsh
set -euo pipefail
export NODE_BINARY="$(which node)"
cd ios
pod repo update
pod install
