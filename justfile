SITE := "site"

# build the documentation site
build: copy content versions

init:
    mkdir -p "{{SITE}}"

copy: init
    cp redirects "{{SITE}}/_redirects"

content: init
    deno run -A build-site.ts

versions: init
    jsonnet -o "{{SITE}}/versions.json" versions.jsonnet

# remove the built site
clean:
    rm -rf {{SITE}}