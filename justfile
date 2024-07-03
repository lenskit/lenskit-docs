SITE := "site"

# build the documentation site
build: copy content versions

init:
    mkdir -p "{{SITE}}"

copy: init
    cp redirects "{{SITE}}/_redirects"
    cp headers "{{SITE}}/_headers"
    cp index.html "{{SITE}}"

content: init
    deno run -A copy-docs.ts

versions: init
    deno run -A versions.ts -o "{{SITE}}/versions.json"

# remove the built site
clean:
    rm -rf {{SITE}}

# deploy to Netlify
deploy:
    netlify deploy --prod -d site
