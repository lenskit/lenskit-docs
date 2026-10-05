#!/bin/zsh

. stdlib.zsh || exit 2

extract_version() {
    local v="$1"
    emulate -L zsh -o pipefail
    msg "extracting version $1"
    mkdir -p "site/$v"
    git archive --format=tar "version/$v" | tar xf - -C "site/$v"
    return $?
}

VERSIONS=($(jq -r '.[] | .version' <site/versions.json))

for ver in "${VERSIONS[@]}"; do
    if [[ $ver = main ]]; then continue; fi

    extract_version "$ver" || die "failed to extract version $ver"
done

extract_version stable || die "failed to extract stable"
extract_version latest || die "failed to extract latest"
