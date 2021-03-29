#!/bin/bash

cd server
tsc --project ./tsconfig.json
cd - 
cp -rf server/dist/* amplify/backend/function/$1/src
mv amplify/backend/function/$1/src/$1.js amplify/backend/function/$1/src/index.js

cp -rf server/node_modules amplify/backend/function/$1/src
cd -