#!/bin/zsh

. stdlib.zsh || exit 2
require run-cmd
set -e

git fetch origin
for ref in $(git branch -r --list 'origin/version/*'); do
    branch="${ref##origin/}"
    msg -dbg "checking branch $branch ($ref)"
    if ! git show-ref --branches $branch >/dev/null 2>&1; then
        msg "creating branch $branch ($ref)"
        run-cmd -check git branch -t $branch $ref
    fi
done
