#!/bin/bash

# Xóa bản build cũ của client nếu có
if [ -d "./client/dist" ]; then
  rm -rf ./client/dist
fi
# Xóa bản build cũ của server nếu có
if [ -d "./server/dist" ]; then
  rm -rf ./server/dist
fi
if [ -d "./server/client" ]; then
  rm -rf ./server/client
fi
if [ -d "./server/server" ]; then
  rm -rf ./server/server
fi

# Build client
cd client
npm install
npm run build
mv dist ../server/client
rm -rf dist
# Build server
cd ../server
npm install
# Tạo client code
npm run db:client
npm run build
mv dist server
rm -rf dist
