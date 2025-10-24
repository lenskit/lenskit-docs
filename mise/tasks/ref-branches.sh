#!/bin/sh

set -e

git fetch origin
for ref in $(git branch -r --list 'origin/version/*'); do
    branch="${ref##origin/}"
    echo "checking branch $branch ($ref)"
    if ! git show-ref --branches $branch >/dev/null 2>&1; then
        git branch -t $branch $ref
    fi
done
