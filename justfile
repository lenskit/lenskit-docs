export PATH := x"$PWD/stdlib.zsh/bin:$PATH"

# create local refs for versioned branches
ref-branches:
    ./scripts/ref-branches.sh

# copy static site assets
copy-static:
    rsync -rv static/ site/

# prepare version list
versions: ref-branches
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
