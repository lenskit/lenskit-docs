SITE := "site"

# build the documentation site
build: copy content versions

init:
    mkdir -p "{{SITE}}"

copy: init
    cp index.html _redirects _headers "{{SITE}}"

content: init
    deno run -A copy-docs.ts

versions: init
    deno run -A versions.ts -o "{{SITE}}/versions.json"

# remove the built site
clean:
    rm -rf {{SITE}}

# make local branches
ref-branches:
    #!/bin/sh
    for branch in $(git branch -r --list 'origin/version/*'); do
        git branch -t ${branch##origin/} $branch
    done

# deploy to Netlify
deploy:
    netlify deploy --prod -d site
