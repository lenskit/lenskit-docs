export PATH := x"$PWD/stdlib.zsh/bin:$PATH"

# initialize the site build dir
_init:
    mkdir -p site

# create local refs for versioned branches
ref-branches:
    ./scripts/ref-branches.sh

# copy static site assets
copy-static:
    rsync -rv static/ site/

# prepare version list
versions: ref-branches _init
    ./scripts/versions.tcl

# export versioned documentation
export-docs: versions
    ./scripts/export-docs.sh

# build the documentation site
[default]
build: copy-static versions export-docs

# remove generated site
clean:
    rm -rf site
