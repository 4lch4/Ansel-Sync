#!/bin/bash

APP_NAME='ansel-sync'

docker run -d --rm \
  -e SPACES_ENDPOINT='' \
  -e SPACES_ACCESS_KEY_ID='' \
  -e SPACES_SECRET_ACCESS_KEY='' \
  -e SPACES_BUCKET_NAME='' \
  -e SPACES_DELIMETER='' \
  -e REDIS_CONNECTION_STRING='' \
  -e IMAGES_BASE_URL='' \
  --name $APP_NAME 4lch4/ansel-sync:latest

docker logs $APP_NAME --follow
