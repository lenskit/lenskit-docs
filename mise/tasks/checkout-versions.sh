#!/usr/bin/env bash
#MISE description="Checkout versions"
#MISE depends=["versions"]

set -eo pipefail

checkout_version() {
    local v="$1"
    if [[ -d versions/$v ]]; then
        echo "$v already checked out" >&2
        return
    fi

    mkdir -p versions
    git worktree add versions/$v version/$v
}

VERSIONS=($(jq -r '.[] | .version' <site/versions.json))

for ver in "${VERSIONS[@]}"; do
    if [[ $ver = main ]]; then continue; fi

    checkout_version "$ver"
done
