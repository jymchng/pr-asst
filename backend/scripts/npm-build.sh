#!/bin/bash

# Check if an argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 [development|production]"
    exit 1
fi

# if [ "$#" -eq 2 ]; then
#     if [ $2 -ne "watch" ]; then
#         echo "Usage: $0 [development|production] [watch]"
#         exit 1
#     fi
#     WATCH="--$2"
# else
#     WATCH=""
# fi

# Get the environment from the first argument
ENV=$1

function log() {
    local message=$1
    echo "[npm-build.sh::INFO] "$message
}

# Validate environment parameter
if [[ "$ENV" != "development" && "$ENV" != "production" ]]; then
    log "Invalid environment specified: $ENV"
    log "Please specify 'development' or 'production'."
    exit 1
fi

# Set ENV_SHORT based on ENV
if [ "$ENV" = "development" ]; then
    ENV_SHORT="dev"
    BUILD_FOLDER=build-$ENV_SHORT
    # Optional: export it if needed in subshells or external scripts
else
    ENV_SHORT="prod"
    BUILD_FOLDER=build
fi
LOG_DIR=./$BUILD_FOLDER/"$ENV"_logs

rm -fr ${BUILD_FOLDER}

TS_CONFIG_FILENAME=tsconfig.$BUILD_FOLDER
log "\`TS_CONFIG_FILENAME\` = \`$TS_CONFIG_FILENAME\`"

# Define function to build for development
build_development() {
    npx cross-env NODE_ENV=$ENV nest build --path ./$TS_CONFIG_FILENAME.json --tsc || exit 1
    npx cross-env NODE_ENV=$ENV npm run copy-files-dev

    # Call the copy files script for development
    log "Calling copyfiles.sh for development..."
    
}

# Define function to build for production
build_production() {
    npx cross-env NODE_ENV=$ENV nest build --path ./$TS_CONFIG_FILENAME.json --tsc || exit 1
    npm run copy-files

    # Call the copy files script for production
    log "Calling copyfiles.sh for production..."
}

# Common pre-invocations
# log "Running build for $ENV..."
# rm -fr $BUILD_FOLDER
#     npx cross-env NODE_ENV=$ENV npx tsx build.ts

# npx prisma generate
# log "Running cat prisma/schema.prisma"

# Decision making based on the environment
case "$ENV" in
    "development")
        build_development
        ;;
    "production")
        build_production
        ;;
    *)
        log "Invalid environment specified: $ENV"
        log "Please specify 'development' or 'production'."
        exit 1
        ;;
esac

# Common post-invocations
if [ "$ENV" = "production" ]; then
    log "Minifying all \`.js\` files inside \`$BUILD_FOLDER\` in \`production\`"
    find $BUILD_FOLDER -type f -name "*.js" -exec bash -c 'npx esbuild --bundle "{}" --minify --sourcemap --platform=node --outfile="{}" --allow-overwrite' \; || exit 1
    log "Minified all \`.js\` files!"
else
    log "Since \`NODE_ENV = 'development'\`, no minification of transpiled JS files is done!"
fi
log "Making logs directory in $LOG_DIR"
mkdir -p $LOG_DIR || exit 1
bash scripts/copyfiles.sh $ENV || exit 1

# cat prisma/schema.prisma
# echo "Running ls -la ./node_modules/@prisma/client"
# ls -la ../node_modules/@prisma/client
# echo "Running ls -la ./node_modules/.prisma/client"
# ls -la ../node_modules/.prisma/client
exit 0