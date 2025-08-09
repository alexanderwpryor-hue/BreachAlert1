#!/bin/zsh
set -euo pipefail

# Install JS deps
if [ -f yarn.lock ]; then
  yarn install --frozen-lockfile
else
  npm ci
fi

# CocoaPods is preinstalled, but this keeps logs clearer
gem install cocoapods --no-document || true
