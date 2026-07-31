#!/usr/bin/env guarsh
#MISE description="Create version manifest file."
#MISE depends=["ref-branches"]
#USAGE flag "-v --verbose" help="Enable verbose log messages."

package require logging

set url_base https://lenskit.org
set manifest [td list]

proc add_version {spec} {
    global manifest
    set v [td record]
    set spec [uplevel [list subst $spec]]
    foreach {field value} $spec {
        switch $field {
            preferred {
                td set v preferred [td bool $value]
            }
            default {
                td set v $field [td string $value]
            }
        }
    }
    set ver [td get -native $v version]
    msg "added version $ver"
    td lappend manifest $v
}

proc extract_version {ref} {
    msg -dbg "extracting version from $ref"
    if {[regexp {refs.*version/(.*)} $ref -> tail]} {
        return $tail
    } else {
        error "invalid version ref: $ref"
    }
}

set refs_by_date [exec git for-each-ref --sort=-creatordate --format %(refname) --tcl refs/heads/version/*.*]
set refs_by_version [exec git for-each-ref --sort=-v:refname --format %(refname) --tcl refs/heads/version/*.*]

set stable [extract_version [lindex $refs_by_version 0]]

add_version {
    name Latest
    version main
    url $url_base/latest/
}

add_version {
    name "$stable (stable)"
    version $stable
    url $url_base/stable/
}

foreach ref $refs_by_date {
    set ver [extract_version $ref]
    if {$ver ne $stable} {
        add_version {
            name $ver
            version $ver
            url $url_base/$ver/
        }
    }
}

msg "accumulated [td length $manifest] versions"
td dump json -pretty -file site/versions.json $manifest
