###################
# BUILD FOR LOCAL DEVELOPMENT AND PRODUCTION
###################

FROM node:18-alpine As build

ARG BUILD_ENV

WORKDIR /usr/src/app

# Install git and SSH
RUN apk add --no-cache git openssh bash

# Create app directory

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./


# Bundle app source
COPY . .
RUN file=$(ls -la .) && echo $file

RUN npm run build-all -- ${BUILD_ENV}

USER node
CMD ls -la . && pwd -P && echo "BUILDS FOR LOCAL DEVELOPMENT AND PRODUCTION ARE COMPLETED!"


###################
# DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

# RUN file="$(ls -la .)" && echo $file && pwd -P
# COPY --from=build /usr/src/app/build-dev ./build-dev
COPY --from=build /usr/src/app/build-dev .
COPY --from=build /usr/src/app/node_modules ./node_modules
# RUN npx prisma generate --schema ./build-dev/prisma/schema.prisma

# bash scripts/npm-build will make these directories
# RUN mkdir -m 777 ./build-dev/development_logs
RUN chown -R node:node ./development_logs

USER node
CMD pwd -P && echo "Running ls -la ." && \
    ls -la . && \
    echo "Running ls -la /run" && \
    ls -la /run && \
    # echo "Running ls -la ./build-dev" && \
    # ls -la ./build-dev && \
    echo "Running ls -la ./node_modules/@prisma/client" && \
    ls -la ./node_modules/@prisma/client && \
    echo "Running ls -la ./node_modules/.prisma/client" && \
    ls -la ./node_modules/.prisma/client && \
    # cd build-dev/ && \
    node src/bin/main.js

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/build .
COPY --from=build /usr/src/app/node_modules ./node_modules
# RUN npx prisma generate --schema ./build/prisma/schema.prisma

# bash scripts/npm-build will make these directories
# RUN mkdir ./build/production_logs
RUN chown -R node:node ./production_logs

USER node
CMD pwd -P && echo "Running ls -la ." && \
    ls -la . && \
    echo "Running ls -la /run" && \
    ls -la /run && \
    # echo "Running ls -la ./build" && \
    # ls -la ./build && \
    echo "Running ls -la ./node_modules/@prisma/client" && \
    ls -la ./node_modules/@prisma/client && \
    echo "Running ls -la ./node_modules/.prisma/client" && \
    ls -la ./node_modules/.prisma/client && \
    # cd build/ && \
    node src/bin/main.js