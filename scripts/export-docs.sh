#!/bin/bash

set -eo pipefail

extract_version() {
    local v="$1"
    echo "extracting version $1"
    mkdir -p "site/$v"
    git archive --format=tar "version/$v" | tar xf - -C "site/$v"
}

VERSIONS=($(jq -r '.[] | .version' <site/versions.json))

for ver in "${VERSIONS[@]}"; do
    if [[ $ver = main ]]; then continue; fi

    extract_version "$ver"
done

extract_version stable
extract_version latest
