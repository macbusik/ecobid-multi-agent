#!/bin/bash
set -e
cd "$(dirname "$0")/../frontend"
npm ci --cache .npm --prefer-offline
npm run build
