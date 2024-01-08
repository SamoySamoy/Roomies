#!/bin/bash

# Xóa bản build cũ của server nếu có
if [ -d "./server/dist" ]; then
  rm -rf ./server/dist
fi
if [ -d "./server/server" ]; then
  rm -rf ./server/server
fi

# Build server
cd server
npm install
# Tạo client code
npm run db:client
npm run build
mv dist server
rm -rf dist
