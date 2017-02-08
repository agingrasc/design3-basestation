#!/bin/sh
echo "URL : $1"
python ./server/main.py $1 & 
cd ./client
serve
