#!/bin/bash

DEST_PREFIX=$1
shift

DEPLOY_DEST=${DEST_PREFIX}babel/firebird-common
DEPLOY_SRC=/htapps/test.babel/firebird-common

INCLUDE=$(cat <<EOT
  $DEPLOY_SRC/dist
EOT
)

EXCLUDE=$(cat <<EOT
  --exclude index.html
EOT
)

/usr/bin/rsync "$@" $EXCLUDE $INCLUDE $DEPLOY_DEST
