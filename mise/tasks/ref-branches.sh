#!/bin/sh

set -e

for ref in $(git branch -r --list 'origin/version/*'); do
    branch="${ref##origin/}"
    if ! git show-ref $branch >/dev/null 2>&1; then
        git branch -t $branch $ref
    fi
done
